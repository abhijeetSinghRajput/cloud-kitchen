import { Button } from "@/components/ui/button";

import { Plus, Edit, Trash2, ChevronLeft, CupSoda } from "lucide-react";
import React, { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/constants/category";
import { slug } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";
import FoodItemDialog from "@/components/admin/FoodItemDialog";


const FoodItemPage = () => {
  const { categoryName } = useParams();
  const category = categories.find(
    (category) => slug(category.name) === categoryName
  );
  
  const [items, setItems] = useState(category?.items || []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Update items when category changes
  React.useEffect(() => {
    if (category) {
      setItems(category.items || []);
    }
  }, [category]);

  const handleOpenDialog = (item = null) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleSaveItem = (itemData) => {
    if (itemData.id) {
      // Update existing item
      setItems(prev => prev.map(item => 
        item.id === itemData.id ? { ...item, ...itemData } : item
      ));
    } else {
      // Add new item (generate a simple ID)
      const newItem = { 
        ...itemData, 
        id: Date.now().toString(),
        image: itemData.file ? URL.createObjectURL(itemData.file) : "/placeholder-image.jpg"
      };
      setItems(prev => [...prev, newItem]);
    }
    handleCloseDialog();
  };

  const handleDeleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    handleCloseDialog();
  };

  if (!category) {
    return (
      <div className="mt-16 flex flex-col gap-6 items-center justify-center">
        <div className="size-40 bg-muted flex rounded-full items-center justify-center">
          <CupSoda className="size-1/2 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-muted-foreground text-base">
            No Category named{" "}
            <span className="text-primary font-bold">{categoryName}</span>
          </p>
          <Link
            to={"/admin/category"}
            className="border flex items-center gap-2 w-max mx-auto py-1.5 px-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <ChevronLeft className="size-5" />
            Back To Category
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
            <Link to={'/admin/category'}>{category.name}</Link>
        </h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 size-4" /> Add Item
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((item, index) => (
          <Card 
            key={index} 
            className="cursor-pointer overflow-hidden hover:shadow-md transition-shadow"
            onClick={() => handleOpenDialog(item)}
          >
            <CardContent className="p-0">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3>
                  <span className="font-bold">₹{item.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-secondary px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <FoodItemDialog
        item={selectedItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
      />
    </div>
  );
};


export default FoodItemPage;
