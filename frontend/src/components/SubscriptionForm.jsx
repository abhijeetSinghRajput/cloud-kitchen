// SubscriptionForm.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";

const SubscriptionForm = ({ open, setOpen, selectedOrder }) => {
  const { requestSubscription, loading, errors } = useSubscriptionStore();

  // Local form state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
  });

  // ✅ Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ Handle submit
  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.location) {
      alert("Please fill all fields!");
      return;
    }

    await requestSubscription({
      ...form,
      order: selectedOrder?.header,
    });

    if (!errors.requestSubscription) {
      setOpen(false); // close dialog if successful
      setForm({ name: "", phone: "", location: "" }); // reset form
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ scale: 0.3, opacity: 0, y: 80 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 15,
                bounce: 0.45,
              }}
              className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-2xl w-[400px] mx-auto border border-purple-200 dark:border-purple-800"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-purple-600">
                  Confirm Purchase
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-purple-600 dark:text-purple-400"
                  >
                    Name
                  </Label>
                  <Input
                    className="h-11 rounded-lg border-purple-300 focus:ring-purple-500 focus:border-purple-500"
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-purple-600 dark:text-purple-400"
                  >
                    Phone
                  </Label>
                  <Input
                    className="h-11 rounded-lg border-purple-300 focus:ring-purple-500 focus:border-purple-500"
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="location"
                    className="text-purple-600 dark:text-purple-400"
                  >
                    Location
                  </Label>
                  <Input
                    className="h-11 rounded-lg border-purple-300 focus:ring-purple-500 focus:border-purple-500"
                    id="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Client Town, Lane no 10"
                  />
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/40 p-3 rounded-lg border border-purple-200 dark:border-purple-700">
                  <p className="text-sm text-purple-500">Selected Order:</p>
                  <p className="font-semibold text-purple-700 dark:text-purple-300">
                    {selectedOrder?.header || "No order selected"}
                  </p>
                </div>
              </div>

              {errors.requestSubscription && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.requestSubscription}
                </p>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="border-purple-500 text-purple-600 hover:bg-purple-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading.requestSubscription}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading.requestSubscription ? "Processing..." : "Confirm"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionForm;
