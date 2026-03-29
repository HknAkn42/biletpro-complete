-- RLS Policies for BiletPro
-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable all operations for all users" ON events;
DROP POLICY IF EXISTS "Enable all operations for all users" ON customers;
DROP POLICY IF EXISTS "Enable all operations for all users" ON sales;
DROP POLICY IF EXISTS "Enable all operations for all users" ON tables;
DROP POLICY IF EXISTS "Enable all operations for all users" ON categories;

-- Create new policies for all users (including anonymous)
CREATE POLICY "Enable all operations for all users" ON events
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" ON customers
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" ON sales
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" ON tables
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" ON categories
    FOR ALL USING (true) WITH CHECK (true);
