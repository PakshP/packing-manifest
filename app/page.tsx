"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { BAGS, INITIAL_CATEGORIES } from "@/lib/data";
import type {
  BagId,
  Category,
  CheckedMap,
  PackingListRow,
  SaveStatus,
  ViewMode,
} from "@/types";

import AuthScreen from "@/components/AuthScreen";
import LoadingScreen from "@/components/LoadingScreen";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ProgressCard from "@/components/ProgressCard";
import ViewModeToggle from "@/components/ViewModeToggle";
import TabStrip, { type TabItem } from "@/components/TabStrip";
import CategoryPanel from "@/components/CategoryPanel";
import BagPanel from "@/components/BagPanel";
import ListActionsBar from "@/components/ListActionsBar";
import AccountModal from "@/components/AccountModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ChatLauncher from "@/components/chat/ChatLauncher";
import ChatPanel from "@/components/chat/ChatPanel";
import { useChatStore } from "@/lib/chat-store";

type ConfirmRequest = {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
};

const SAVE_DEBOUNCE_MS = 500;
const SAVED_BADGE_MS = 1500;

function makeItemId(): string {
  return `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [listId, setListId] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [listLoaded, setListLoaded] = useState(false);

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [checked, setChecked] = useState<CheckedMap>({});

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("");
  const [viewMode, setViewMode] = useState<ViewMode>("category");
  const [activeTab, setActiveTab] = useState<string>(INITIAL_CATEGORIES[0].id);

  const [accountOpen, setAccountOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { messages: chatMessages, send: chatSend, thinking: chatThinking } =
    useChatStore();

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextSaveRef = useRef(true);

  // ----- Auth subscription -----
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (!mounted) return;
      setSession(sess);
      if (!sess) {
        setListId(null);
        setListLoaded(false);
        setCreatedAt(null);
        setCategories(INITIAL_CATEGORIES);
        setChecked({});
        setAccountOpen(false);
        setConfirmRequest(null);
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // ----- Load (or create) the list row when a session is present -----
  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    (async () => {
      skipNextSaveRef.current = true;

      const { data, error } = await supabase
        .from("packing_lists")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Failed to load packing list:", error);
        return;
      }

      if (data) {
        const row = data as PackingListRow;
        setListId(row.id);
        setCreatedAt(row.created_at);
        const cats =
          Array.isArray(row.categories) && row.categories.length > 0
            ? row.categories
            : INITIAL_CATEGORIES;
        setCategories(cats);
        setChecked(row.checked_items ?? {});
        setListLoaded(true);
        return;
      }

      // No row: seed one.
      const { data: created, error: insErr } = await supabase
        .from("packing_lists")
        .insert({
          user_id: session.user.id,
          categories: INITIAL_CATEGORIES,
          checked_items: {},
        })
        .select()
        .single();

      if (cancelled) return;
      if (insErr || !created) {
        console.error("Failed to create packing list:", insErr);
        return;
      }

      const row = created as PackingListRow;
      setListId(row.id);
      setCreatedAt(row.created_at);
      setCategories(INITIAL_CATEGORIES);
      setChecked({});
      setListLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [session]);

  // ----- Reset active tab when view mode changes -----
  useEffect(() => {
    if (viewMode === "category") {
      const valid = categories.find((c) => c.id === activeTab);
      if (!valid && categories[0]) setActiveTab(categories[0].id);
    } else {
      const valid = BAGS.find((b) => b.id === activeTab);
      if (!valid) setActiveTab(BAGS[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  // ----- Debounced save -----
  useEffect(() => {
    if (!listId || !listLoaded) return;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    setSaveStatus("saving");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      const { error } = await supabase
        .from("packing_lists")
        .update({ categories, checked_items: checked })
        .eq("id", listId);

      if (error) {
        console.error("Save failed:", error);
        setSaveStatus("");
        return;
      }
      setSaveStatus("saved");
      if (savedClearRef.current) clearTimeout(savedClearRef.current);
      savedClearRef.current = setTimeout(() => {
        setSaveStatus((s) => (s === "saved" ? "" : s));
      }, SAVED_BADGE_MS);
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [categories, checked, listId, listLoaded]);

  // ===== Mutations =====
  const toggleItem = useCallback((itemId: string) => {
    setChecked((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  }, []);

  const setItemBag = useCallback((itemId: string, bag: BagId | null) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.map((it) =>
          it.id === itemId ? { ...it, bag } : it
        ),
      }))
    );
  }, []);

  const addItem = useCallback((categoryId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: [
                ...cat.items,
                {
                  id: makeItemId(),
                  name: trimmed,
                  bag: cat.id === "predeparture" ? null : null,
                },
              ],
            }
          : cat
      )
    );
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.filter((it) => it.id !== itemId),
      }))
    );
    setChecked((prev) => {
      if (!(itemId in prev)) return prev;
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  }, []);

  const checkAllInCategory = useCallback(
    (categoryId: string) => {
      const cat = categories.find((c) => c.id === categoryId);
      if (!cat) return;
      setChecked((prev) => {
        const next = { ...prev };
        cat.items.forEach((it) => {
          next[it.id] = true;
        });
        return next;
      });
    },
    [categories]
  );

  const uncheckAllInCategory = useCallback(
    (categoryId: string) => {
      const cat = categories.find((c) => c.id === categoryId);
      if (!cat) return;
      setChecked((prev) => {
        const next = { ...prev };
        cat.items.forEach((it) => {
          next[it.id] = false;
        });
        return next;
      });
    },
    [categories]
  );

  const deleteAllInCategory = useCallback((categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, items: [] } : cat
      )
    );
  }, []);

  const checkAllInBag = useCallback(
    (bag: BagId) => {
      setChecked((prev) => {
        const next = { ...prev };
        categories.forEach((cat) =>
          cat.items.forEach((it) => {
            if (it.bag === bag) next[it.id] = true;
          })
        );
        return next;
      });
    },
    [categories]
  );

  const uncheckAllInBag = useCallback(
    (bag: BagId) => {
      setChecked((prev) => {
        const next = { ...prev };
        categories.forEach((cat) =>
          cat.items.forEach((it) => {
            if (it.bag === bag) next[it.id] = false;
          })
        );
        return next;
      });
    },
    [categories]
  );

  const removeAllFromBag = useCallback((bag: BagId) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.map((it) =>
          it.bag === bag ? { ...it, bag: null } : it
        ),
      }))
    );
  }, []);

  const checkAllList = useCallback(() => {
    setChecked(() => {
      const next: CheckedMap = {};
      categories.forEach((cat) =>
        cat.items.forEach((it) => {
          next[it.id] = true;
        })
      );
      return next;
    });
  }, [categories]);

  const uncheckAllList = useCallback(() => setChecked({}), []);

  const resetList = useCallback(() => {
    setCategories(INITIAL_CATEGORIES);
    setChecked({});
  }, []);

  const resetChecks = useCallback(() => setChecked({}), []);

  const requestConfirm = useCallback((req: ConfirmRequest) => {
    setConfirmRequest(req);
  }, []);

  const dismissConfirm = useCallback(() => setConfirmRequest(null), []);

  const onConfirm = useCallback(() => {
    const req = confirmRequest;
    setConfirmRequest(null);
    if (!req) return;
    void Promise.resolve(req.onConfirm()).catch((e) =>
      console.error("Confirm action failed:", e)
    );
  }, [confirmRequest]);

  const handleSignOut = useCallback(async () => {
    setAccountOpen(false);
    await supabase.auth.signOut();
  }, []);

  const handleDeleteAccount = useCallback(async () => {
    setDeleteError(null);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) {
      setDeleteError("Your session has expired — sign in again and retry.");
      return;
    }

    let res: Response;
    try {
      res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      setDeleteError("Network error — please try again.");
      return;
    }

    if (!res.ok) {
      let message = `Delete failed (${res.status}).`;
      try {
        const body = (await res.json()) as { error?: string };
        if (body.error) message = body.error;
      } catch {
        // ignore parse failure, keep generic message
      }
      setDeleteError(message);
      return;
    }

    // Success — sign out so we land back on the auth screen.
    await supabase.auth.signOut();
    setAccountOpen(false);
  }, []);

  // ===== Derived =====
  const allItems = useMemo(
    () => categories.flatMap((c) => c.items),
    [categories]
  );
  const totalItems = allItems.length;
  const packedItems = useMemo(
    () => allItems.filter((i) => checked[i.id]).length,
    [allItems, checked]
  );

  const perBagStats = useMemo(
    () =>
      BAGS.map((bag) => {
        const itemsInBag = allItems.filter((i) => i.bag === bag.id);
        return {
          bag,
          total: itemsInBag.length,
          packed: itemsInBag.filter((i) => checked[i.id]).length,
        };
      }),
    [allItems, checked]
  );

  const tabs: TabItem[] = useMemo(() => {
    if (viewMode === "category") {
      return categories.map((c) => ({
        id: c.id,
        name: c.name,
        iconKey: c.iconKey,
        accent: c.accent,
        count: c.items.length,
      }));
    }
    return BAGS.map((b) => {
      const count = allItems.filter((i) => i.bag === b.id).length;
      return {
        id: b.id,
        name: b.shortName,
        iconKey: b.iconKey,
        accent: b.accent,
        count,
      };
    });
  }, [viewMode, categories, allItems]);

  // ===== Render =====
  if (authLoading) return <LoadingScreen />;
  if (!session) return <AuthScreen />;
  if (!listLoaded) return <LoadingScreen />;

  const activeCategory =
    viewMode === "category"
      ? categories.find((c) => c.id === activeTab) ?? categories[0]
      : null;
  const activeBag =
    viewMode === "bag"
      ? BAGS.find((b) => b.id === activeTab) ?? BAGS[0]
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-ink-primary topo-bg">
      <TopNav
        user={session.user}
        saveStatus={saveStatus}
        onAvatarClick={() => {
          setDeleteError(null);
          setAccountOpen(true);
        }}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <PageHero />

        <ProgressCard
          totalItems={totalItems}
          packedItems={packedItems}
          perBagStats={perBagStats}
        />

        <ListActionsBar
          totalItems={totalItems}
          packedItems={packedItems}
          onCheckAll={checkAllList}
          onUncheckAll={uncheckAllList}
          onResetList={() =>
            requestConfirm({
              title: "Delete entire list and start over?",
              description:
                "This restores the default categories and removes any custom items you've added. Checked items will be cleared.",
              confirmLabel: "Reset list",
              onConfirm: resetList,
            })
          }
        />

        <div className="flex flex-col gap-4">
          <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
          <TabStrip tabs={tabs} activeId={activeTab} onSelect={setActiveTab} />
        </div>

        {viewMode === "category" && activeCategory && (
          <CategoryPanel
            key={activeCategory.id}
            category={activeCategory}
            checked={checked}
            onToggleItem={toggleItem}
            onSetItemBag={setItemBag}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onCheckAll={() => checkAllInCategory(activeCategory.id)}
            onUncheckAll={() => uncheckAllInCategory(activeCategory.id)}
            onDeleteAll={() =>
              requestConfirm({
                title: `Delete all items in ${activeCategory.name}?`,
                description:
                  "Items in this category will be removed. You can reset the entire list to defaults from the danger zone.",
                confirmLabel: "Delete items",
                onConfirm: () => deleteAllInCategory(activeCategory.id),
              })
            }
          />
        )}

        {viewMode === "bag" && activeBag && (
          <BagPanel
            key={activeBag.id}
            bag={activeBag}
            categories={categories}
            checked={checked}
            onToggleItem={toggleItem}
            onSetItemBag={setItemBag}
            onRemoveItem={removeItem}
            onCheckAll={() => checkAllInBag(activeBag.id)}
            onUncheckAll={() => uncheckAllInBag(activeBag.id)}
            onRemoveAll={() =>
              requestConfirm({
                title: `Remove all items from ${activeBag.name}?`,
                description:
                  "Items will be unassigned from this bag — they remain in their categories.",
                confirmLabel: "Remove from bag",
                onConfirm: () => removeAllFromBag(activeBag.id),
              })
            }
          />
        )}
      </main>

      <Footer />

      <AccountModal
        open={accountOpen}
        user={session.user}
        createdAt={createdAt}
        deleteError={deleteError}
        onClose={() => {
          setAccountOpen(false);
          setDeleteError(null);
        }}
        onSignOut={handleSignOut}
        onResetChecks={() =>
          requestConfirm({
            title: "Reset all checks?",
            description:
              "All items will be marked as unpacked. Custom items remain.",
            confirmLabel: "Reset checks",
            onConfirm: () => {
              resetChecks();
              setAccountOpen(false);
            },
          })
        }
        onResetList={() =>
          requestConfirm({
            title: "Reset entire list to default?",
            description:
              "This restores the original categories and removes any custom items.",
            confirmLabel: "Reset list",
            onConfirm: () => {
              resetList();
              setAccountOpen(false);
            },
          })
        }
        onDeleteAccount={() =>
          requestConfirm({
            title: "Delete your account?",
            description:
              "This permanently deletes your account, your manifest, and any custom items. This cannot be undone.",
            confirmLabel: "Delete account",
            onConfirm: handleDeleteAccount,
          })
        }
      />

      {confirmRequest && (
        <ConfirmDialog
          open
          title={confirmRequest.title}
          description={confirmRequest.description}
          confirmLabel={confirmRequest.confirmLabel ?? "Confirm"}
          onConfirm={onConfirm}
          onCancel={dismissConfirm}
        />
      )}

      <ChatLauncher open={chatOpen} onClick={() => setChatOpen(true)} />
      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={chatMessages}
        onSend={chatSend}
        thinking={chatThinking}
      />
    </div>
  );
}
