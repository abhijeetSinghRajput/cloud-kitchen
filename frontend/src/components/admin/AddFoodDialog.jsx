import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import ImageUpload from "../ImageUpload";

const AddFoodItemDialog = () => {
  const [formData, setFormData] = useState({
    name: "",
    image: "", // will hold preview url
    file: null, // raw file for upload
    description: "",
    price: "",
    tags: "",
  });

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
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      tags: formData.tags.split(",").map((t) => t.trim()),
      image: formData.file, // actual file, use this for backend upload
    };
    onSubmit?.(payload);
    setFormData({
      name: "",
      image: "",
      file: null,
      description: "",
      price: "",
      tags: "",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 size-4" /> Add 
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Food Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Upload */}
          <ImageUpload
            image={formData.image}
            onChange={handleImageChange}
          />

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

          <Button className="w-full" onClick={handleSubmit}>
            Save Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default AddFoodItemDialog;
