import { useEffect, useState } from "react";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

const SubscribersPage = () => {
  const {
    subscriptions,
    fetchSubscriptions,
    deleteSubscription,
    loading,
    errors,
  } = useSubscriptionStore();
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const unsubscribe = fetchSubscriptions();
    return () => unsubscribe && unsubscribe();
  }, [fetchSubscriptions]);

  if (loading.fetchSubscriptions) return <p>Loading subscribers...</p>;
  if (errors.fetchSubscriptions)
    return <p>Error: {errors.fetchSubscriptions}</p>;
  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-500">
        <img src="/empty-mail.svg" className="grayscale max-w-72" />
        <div className="max-w-md">
          <h2 className="text-xl font-semibold">No subscribers yet</h2>
          <p className="text-sm text-muted-foreground">
            Once users start subscribing to your plans, their details will
            appear here in real-time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-6">Subscribers</h1>

      <ul className="space-y-4">
        {subscriptions.map((sub) => (
          <li
            key={sub.id}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow hover:shadow-md transition flex justify-between items-center"
          >
            <div>
              <p>
                <strong>Name:</strong> {sub.name}
              </p>
              <p>
                <strong>Phone:</strong> {sub.phone}
              </p>
              <p>
                <strong>Location:</strong> {sub.location}
              </p>
              <p>
                <strong>Selected Plan:</strong> {sub.order}
              </p>
            </div>

            {/* Delete Button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteId(sub.id)}
            >
              {loading[`delete_${sub.id}`] ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>

            {/* Confirmation Dialog */}
            <AlertDialog
              open={deleteId === sub.id}
              onOpenChange={(open) => !open && setDeleteId(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                  <p>Are you sure you want to delete this subscription?</p>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={async () => {
                      await deleteSubscription(sub.id);
                      setDeleteId(null);
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubscribersPage;
