import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import React, { useState } from "react";
import ImageUpload from "../ImageUpload";
import { Trash2 } from "lucide-react";

const FoodItemDialog = ({
  item = null,
  onSave,
  onDelete,
  open = false,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    image: item?.image || "", // will hold preview url
    file: null, // raw file for upload
    description: item?.desc || "",
    price: item?.price || "",
    tags: item?.tags?.join(", ") || "",
  });

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  React.useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        image: item.image || "",
        file: null,
        description: item.desc || "",
        price: item.price || "",
        tags: item.tags?.join(", ") || "",
      });
    } else {
      setFormData({
        name: "",
        image: "",
        file: null,
        description: "",
        price: "",
        tags: "",
      });
    }
  }, [item, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image: previewUrl, file }));
  };

  const handleSubmit = () => {
    const payload = {
      id: item?.id, // Include ID for updates
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      tags: formData.tags.split(",").map((t) => t.trim()),
      image: formData.file || item?.image, // use existing image if no new file
    };
    onSave(payload);
  };

  const handleDelete = () => {
    onDelete(item.id);
    setIsDeleteAlertOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {item ? "Edit Food Item" : "Add New Food Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Image Upload */}
            <ImageUpload image={formData.image} onChange={handleImageChange} />

            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter food name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a short description..."
              />
            </div>

            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="100"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="spicy, veg, popular"
              />
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSubmit}>
                {item ? "Update" : "Save"} Item
              </Button>

              {item && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsDeleteAlertOpen(true)}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              food item "{item?.name}" from your menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FoodItemDialog;
