-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create Policy: Users can only see products from their own org
CREATE POLICY "Users can see own org products" ON products
FOR ALL USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Atomic Sale Function (Prevents stock going below zero)
CREATE OR REPLACE FUNCTION sell_product_atomic(p_product_id UUID, p_quantity INT, p_sold_by UUID)
RETURNS void AS $$
BEGIN
  UPDATE products 
  SET stock = stock - p_quantity 
  WHERE id = p_product_id AND stock >= p_quantity;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock';
  END IF;

  INSERT INTO sales (organization_id, product_id, sold_by, quantity, sold_price)
  SELECT organization_id, p_product_id, p_sold_by, p_quantity, price
  FROM products WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;