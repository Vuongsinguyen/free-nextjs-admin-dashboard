-- Invoices Management Schema
-- Created: 2025-11-01

-- Drop existing table if exists
DROP TABLE IF EXISTS invoices CASCADE;

-- Create invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE,
    apartment TEXT NOT NULL,
    resident_name TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
    status TEXT CHECK (status IN ('paid', 'unpaid', 'overdue')) DEFAULT 'unpaid',
    due_date DATE NOT NULL,
    notes TEXT,
    -- Fee breakdowns
    water_fee DECIMAL(12, 2) DEFAULT 0 CHECK (water_fee >= 0),
    management_fee DECIMAL(12, 2) DEFAULT 0 CHECK (management_fee >= 0),
    urban_management_fee DECIMAL(12, 2) DEFAULT 0 CHECK (urban_management_fee >= 0),
    parking_fee DECIMAL(12, 2) DEFAULT 0 CHECK (parking_fee >= 0),
    late_payment_penalty DECIMAL(12, 2) DEFAULT 0 CHECK (late_payment_penalty >= 0),
    other_fees DECIMAL(12, 2) DEFAULT 0 CHECK (other_fees >= 0),
    area DECIMAL(8, 2) NOT NULL CHECK (area > 0), -- m2
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_apartment ON invoices(apartment);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_resident_name ON invoices(resident_name);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

CREATE TRIGGER invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_invoices_updated_at();

-- Enable Row Level Security
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (full access)
CREATE POLICY "Allow authenticated users to read invoices"
    ON invoices FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert invoices"
    ON invoices FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update invoices"
    ON invoices FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete invoices"
    ON invoices FOR DELETE
    TO authenticated
    USING (true);

-- Create policies for anon users (no access to invoices)
CREATE POLICY "Deny anon users access to invoices"
    ON invoices FOR SELECT
    TO anon
    USING (false);

-- Insert sample data
INSERT INTO invoices (
    invoice_number,
    apartment,
    resident_name,
    amount,
    status,
    due_date,
    notes,
    water_fee,
    management_fee,
    urban_management_fee,
    parking_fee,
    late_payment_penalty,
    other_fees,
    area
) VALUES 
('INV-2025-001', 'A101', 'Nguyễn Văn A', 5000000, 'paid', '2025-01-15', 'Đã thanh toán đầy đủ', 800000, 3000000, 500000, 400000, 0, 300000, 85),
('INV-2025-002', 'A102', 'Trần Thị B', 4500000, 'unpaid', '2025-02-15', '', 750000, 2800000, 450000, 350000, 0, 150000, 78),
('INV-2025-003', 'A103', 'Lê Văn C', 6000000, 'overdue', '2024-12-15', 'Quá hạn thanh toán', 950000, 3500000, 600000, 500000, 450000, 0, 92),
('INV-2025-004', 'B201', 'Phạm Thị D', 5500000, 'paid', '2025-01-20', '', 850000, 3200000, 550000, 450000, 0, 250000, 88),
('INV-2025-005', 'B202', 'Hoàng Văn E', 4800000, 'unpaid', '2025-02-20', '', 700000, 2600000, 480000, 380000, 0, 200000, 75),
('INV-2025-006', 'B203', 'Vũ Thị F', 5200000, 'paid', '2025-01-25', 'Đã chuyển khoản', 780000, 2900000, 520000, 420000, 0, 0, 82),
('INV-2025-007', 'C301', 'Đặng Văn G', 7000000, 'overdue', '2024-11-30', 'Cần liên hệ khẩn', 1100000, 4000000, 700000, 600000, 600000, 0, 105),
('INV-2025-008', 'C302', 'Bùi Thị H', 4700000, 'paid', '2025-01-10', '', 680000, 2500000, 470000, 370000, 0, 200000, 72),
('INV-2025-009', 'C303', 'Đinh Văn I', 5300000, 'unpaid', '2025-02-10', '', 790000, 2950000, 530000, 430000, 0, 0, 84),
('INV-2025-010', 'D401', 'Ngô Thị K', 6500000, 'paid', '2025-01-05', 'Thanh toán tiền mặt', 1000000, 3700000, 650000, 550000, 0, 0, 98),
('INV-2025-011', 'D402', 'Dương Văn L', 4900000, 'unpaid', '2025-02-05', '', 720000, 2700000, 490000, 390000, 0, 200000, 76),
('INV-2025-012', 'D403', 'Lý Thị M', 5400000, 'overdue', '2024-12-20', 'Đã nhắc nhở', 820000, 3050000, 540000, 440000, 400000, 0, 86),
('INV-2025-013', 'E501', 'Võ Văn N', 5100000, 'paid', '2025-01-18', '', 760000, 2850000, 510000, 410000, 0, 200000, 80),
('INV-2025-014', 'E502', 'Trương Thị O', 4600000, 'unpaid', '2025-02-18', '', 670000, 2500000, 460000, 360000, 0, 200000, 71),
('INV-2025-015', 'E503', 'Phan Văn P', 5800000, 'paid', '2025-01-22', 'Đã thanh toán online', 880000, 3300000, 580000, 480000, 0, 200000, 90),
('INV-2025-016', 'F601', 'Mai Thị Q', 6200000, 'overdue', '2024-12-10', 'Chưa liên hệ được', 950000, 3550000, 620000, 520000, 530000, 0, 95),
('INV-2025-017', 'F602', 'Hồ Văn R', 4750000, 'paid', '2025-01-12', '', 690000, 2580000, 475000, 375000, 0, 200000, 73),
('INV-2025-018', 'F603', 'Tô Thị S', 5250000, 'unpaid', '2025-02-12', '', 780000, 2920000, 525000, 425000, 0, 200000, 83),
('INV-2025-019', 'G701', 'La Văn T', 5600000, 'paid', '2025-01-28', 'Đã xác nhận', 840000, 3150000, 560000, 460000, 0, 200000, 89),
('INV-2025-020', 'G702', 'Từ Thị U', 4850000, 'unpaid', '2025-02-28', '', 710000, 2660000, 485000, 385000, 0, 200000, 74),
('INV-2025-021', 'G703', 'Ông Văn V', 5350000, 'overdue', '2024-12-05', 'Đã gửi email nhắc nhở', 800000, 3000000, 535000, 435000, 430000, 0, 87),
('INV-2025-022', 'H801', 'Bà Thị W', 6800000, 'paid', '2025-01-08', '', 1050000, 3900000, 680000, 580000, 0, 200000, 102),
('INV-2025-023', 'H802', 'Cô Văn X', 4950000, 'unpaid', '2025-02-08', '', 730000, 2740000, 495000, 395000, 0, 200000, 77),
('INV-2025-024', 'H803', 'Chú Thị Y', 5450000, 'paid', '2025-01-16', 'Đã thanh toán qua app', 820000, 3070000, 545000, 445000, 0, 200000, 85),
('INV-2025-025', 'I901', 'Anh Văn Z', 5700000, 'overdue', '2024-11-25', 'Cần gọi điện thoại', 860000, 3220000, 570000, 470000, 490000, 0, 91),
('INV-2025-026', 'I902', 'Chị Thị AA', 4800000, 'paid', '2025-01-14', '', 700000, 2630000, 480000, 380000, 0, 200000, 74),
('INV-2025-027', 'I903', 'Em Văn BB', 5150000, 'unpaid', '2025-02-14', '', 760000, 2850000, 515000, 415000, 0, 200000, 81),
('INV-2025-028', 'J1001', 'Cậu Thị CC', 6300000, 'paid', '2025-01-11', 'Đã nhận biên lai', 960000, 3600000, 630000, 530000, 0, 200000, 96),
('INV-2025-029', 'J1002', 'Dì Văn DD', 4900000, 'unpaid', '2025-02-11', '', 720000, 2700000, 490000, 390000, 0, 200000, 76),
('INV-2025-030', 'J1003', 'Bác Thị EE', 5500000, 'overdue', '2024-12-01', 'Đã gửi thư nhắc nhở', 830000, 3110000, 550000, 450000, 460000, 0, 88);

-- Grant permissions
GRANT ALL ON invoices TO authenticated;
GRANT SELECT ON invoices TO anon;
