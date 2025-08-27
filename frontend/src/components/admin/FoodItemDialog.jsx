import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Alert, AlertDescription } from "@/components/ui/alert";

import React, { useState, useEffect, useCallback } from "react";
import ImageUpload from "../ImageUpload";
import { Trash2, Loader2, AlertCircle } from "lucide-react";
import { useCloudinaryStore } from "@/stores/useCloudinaryStore";
import { useInventoryStore } from "@/stores/useInventoryStore";

const FoodItemDialog = ({
  item = null,
  open = false,
  onOpenChange,
  folder = "foodItems",
  categoryId,
  onItemUpdated, // Callback for when item is successfully updated/deleted
}) => {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    file: null,
    description: "",
    price: "",
    tags: "",
  });

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { 
    uploadImage, 
    deleteImage, 
    deleteImageFallback,
    loading: cloudLoading, 
    error: cloudError,
    clearError: clearCloudError 
  } = useCloudinaryStore();

  const {
    addItem,
    updateItem,
    deleteItem,
    loading: invLoading,
    error: invError,
    clearError: clearInvError,
  } = useInventoryStore();

  // ✅ Initialize form data when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        image: item.image || "",
        file: null,
        description: item.description || "",
        price: item.price?.toString() || "",
        tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
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
    setValidationErrors({});
  }, [item, open]);

  // ✅ Clear errors when dialog opens
  useEffect(() => {
    if (open) {
      clearCloudError();
      clearInvError();
    }
  }, [open, clearCloudError, clearInvError]);

  // ✅ Validate form
  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Item name is required";
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = "Valid price is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // ✅ Handle image selection and upload
  const handleImageChange = async (file) => {
    if (!file) return;

    try {
      clearCloudError();
      
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: previewUrl, file }));

      const result = await uploadImage({
        file,
        folder,
        publicId: item?.id || `item_${Date.now()}`,
        transformation: "c_fill,w_400,h_400,q_auto,f_auto",
      });

      URL.revokeObjectURL(previewUrl);

      setFormData((prev) => ({ 
        ...prev, 
        image: result.url, 
        file: null 
      }));

    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  // ✅ Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Handle save (add or update)
  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!categoryId) {
      setValidationErrors({ general: "Category ID is missing" });
      return;
    }

    try {
      clearInvError();
      clearCloudError();

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
        image: formData.image,
      };

      let result;
      if (item?.id) {
        result = await updateItem(categoryId, item.id, payload);
      } else {
        result = await addItem(categoryId, payload);
      }

      if (onItemUpdated) {
        onItemUpdated(result);
      }

      onOpenChange(false);
    } catch (err) {
      console.error("Save failed:", err);
      setValidationErrors({ general: err.message });
    }
  };

  // ✅ Handle delete with image cleanup
  const handleDelete = async () => {
    if (!item?.id) return;

    try {
      clearInvError();
      clearCloudError();

      const deleteImageFn = item.image 
        ? (deleteImage || deleteImageFallback) 
        : null;

      await deleteItem(item, deleteImageFn);

      if (onItemUpdated) {
        onItemUpdated(null, "deleted");
      }

      setIsDeleteAlertOpen(false);
      onOpenChange(false);
    } catch (err) {
      console.error("Delete failed:", err);
      setValidationErrors({ general: err.message });
      setIsDeleteAlertOpen(false);
    }
  };

  const isLoading = cloudLoading.uploadImage || invLoading.addItem || invLoading.updateItem;
  const isDeleteLoading = invLoading.deleteItem || cloudLoading.deleteImage;
  const hasErrors = cloudError || invError || Object.keys(validationErrors).length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {item ? "Edit Food Item" : "Add New Food Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Error Display */}
            {hasErrors && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {cloudError || invError || validationErrors.general || 
                   Object.values(validationErrors)[0]}
                </AlertDescription>
              </Alert>
            )}

            {/* Image Upload */}
            <div>
              <Label>Item Image</Label>
              <ImageUpload
                image={formData.image}
                onChange={handleImageChange}
                isLoading={cloudLoading.uploadImage}
                error={cloudError}
                className="mt-2"
              />
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter food name"
                className={validationErrors.name ? "border-red-500" : ""}
              />
              {validationErrors.name && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a short description..."
                className={validationErrors.description ? "border-red-500" : ""}
              />
              {validationErrors.description && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.description}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="100"
                className={validationErrors.price ? "border-red-500" : ""}
              />
              {validationErrors.price && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.price}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="spicy, veg, popular"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {item ? "Update Item" : "Add Item"}
              </Button>

              {item && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsDeleteAlertOpen(true)}
                  disabled={isDeleteLoading}
                >
                  {isDeleteLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Food Item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The item and its image will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={isDeleteLoading}
            >
              {isDeleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FoodItemDialog;
