import type { FoodItem } from "@/lib/types";

export const foods: FoodItem[] = [
  {
    id: "pho",
    name: "Phở",
    image: "https://images.unsplash.com/photo-1583224964978-2c0a1a8b1c3d",
    places: [
      { name: "Phở 24", distance: "1.1 km" },
      { name: "Phở Bắc Hải", distance: "900 m" },
      { name: "Phở Hồng", distance: "600 m" },
    ],
  },
  {
    id: "banh_mi",
    name: "Bánh Mì",
    image: "https://images.unsplash.com/photo-1604908176997-4310b5d1f8f2",
    places: [
      { name: "Bánh Mì Bà Lan", distance: "500 m" },
      { name: "Bánh Mì Ông Tý", distance: "800 m" },
      { name: "Bánh Mì Phượng", distance: "1.5 km" },
    ],
  },
  {
    id: "mi_quang",
    name: "Mì Quảng",
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d",
    places: [
      { name: "Mì Quảng Bà Mua", distance: "700 m" },
      { name: "Mì Quảng 1A", distance: "1.3 km" },
      { name: "Mì Quảng Cô Sáu", distance: "600 m" },
    ],
  },
  {
    id: "bun_bo_hue",
    name: "Bún Bò Huế",
    image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f",
    places: [
      { name: "Bún Bò Huế Bà Thương", distance: "1.2 km" },
      { name: "Bún Bò Huế 29", distance: "1.8 km" },
      { name: "Bún Bò Huế Cô Ba", distance: "900 m" },
    ],
  },
];
