
import React from 'react';

export interface Product {
  id: number;
  name_en: string;
  name_bn: string;
  category: string;
  unit: string;
  base_price: number;
  price: number;
  image_url: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_bn: string;
  icon: React.FC<{ className?: string }>;
}

export interface Division {
  name: string;
  bn_name: string;
  price_multiplier: number;
}
