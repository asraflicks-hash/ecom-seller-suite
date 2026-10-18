// src/flatFileAttributesEngine.js - Amazon & Flipkart Pro Category Flat-File & Attribute Engine
// Generates complete 38+ mandatory & recommended category attributes for Amazon Seller Central inventory templates

export function generateFlatFileAttributes({
  platform = 'amazon',
  title = '',
  brand = '',
  category = '',
  productName = '',
  bullets = [],
  sp = 4999,
  mrp = 11999
}) {
  const cleanBrand = (brand || 'ApexPro').trim();
  const cleanTitle = (title || productName || 'Ergonomic High-Back Executive Office Chair').trim();
  const lower = cleanTitle.toLowerCase() + ' ' + (category || '').toLowerCase();

  // Detect product category profile
  const isChairOrFurniture = lower.includes('chair') || lower.includes('sofa') || lower.includes('table') || lower.includes('desk') || lower.includes('furniture') || lower.includes('stool') || lower.includes('cushion') || lower.includes('bed');
  const isApparel = lower.includes('kurta') || lower.includes('saree') || lower.includes('shirt') || lower.includes('tshirt') || lower.includes('dress') || lower.includes('fabric') || lower.includes('jeans');
  const isElectronics = lower.includes('earbud') || lower.includes('headphone') || lower.includes('board') || lower.includes('cable') || lower.includes('charger') || lower.includes('speaker') || lower.includes('mouse') || lower.includes('gadget');
  const isKitchen = lower.includes('chopper') || lower.includes('bottle') || lower.includes('pan') || lower.includes('cookware') || lower.includes('knife') || lower.includes('kitchen');

  const modelNum = `${cleanBrand.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const skuCode = `SSP-${cleanBrand.substring(0, 3).toUpperCase()}-${(cleanTitle.split(' ')[0] || 'PRD').toUpperCase()}-001`;

  // Furniture / Chair Profile (Exact client match)
  if (isChairOrFurniture || (!isApparel && !isElectronics && !isKitchen)) {
    return {
      categoryName: 'Furniture & Ergonomic Seating',
      productType: 'OFFICE_CHAIR',
      browseNode: '3591748031 (Home & Kitchen > Furniture > Home Office Furniture > Office Chairs)',
      hsnCode: '94013000 (Swivel seats with variable height adjustment - 18% GST)',
      sku: skuCode,
      sections: [
        {
          id: 'vital_info',
          title: '1. Vital Identity & Catalog Classification',
          icon: 'Tag',
          attributes: [
            { key: 'Item Name', name: 'item_name', value: cleanTitle, required: true, note: 'Paste in Amazon Vital Info -> Item Name' },
            { key: 'Product Type', name: 'feed_product_type', value: 'OFFICE_CHAIR', required: true, note: 'Amazon Category Feed Type' },
            { key: 'Recommended Browse Node', name: 'recommended_browse_nodes', value: '3591748031', required: true, note: 'Directs listing to Office Chairs browse node' },
            { key: 'External Product ID', name: 'external_product_id', value: 'UPC / EAN / GTIN Exemption Approved', required: true, note: 'Enter 13-digit EAN or check GTIN Exemption' },
            { key: 'Brand Name', name: 'brand', value: cleanBrand, required: true, note: 'Must match registered brand or Generic' },
            { key: 'Model No', name: 'model', value: modelNum, required: true, note: 'Unique manufacturer catalog model' },
            { key: 'Model Name', name: 'model_name', value: `${cleanBrand} ErgoMatrix High-Back`, required: true, note: 'Public series / edition name' },
            { key: 'HSN Code', name: 'hsn_code', value: '94013000', required: true, note: 'Mandatory on Amazon.in (18% GST)' },
            { key: 'Customizable?', name: 'is_customizable', value: 'No', required: false, note: 'Set to Yes only if bespoke order' },
            { key: 'SKU (Stock Keeping Unit)', name: 'sku', value: skuCode, required: true, note: 'Unique seller inventory ID' }
          ]
        },
        {
          id: 'design_build',
          title: '2. Design, Materials & Construction Specs',
          icon: 'Layers',
          attributes: [
            { key: 'Special Features', name: 'special_features', value: 'Ergonomic Lumbar Support, Pneumatic Seat Height Adjustment, 360° Swivel, Tilt Tension Control, Heavy-Duty Castors', required: true, note: 'Displayed prominently below title' },
            { key: 'Style', name: 'style', value: 'Modern Ergonomic', required: true, note: 'Style filter on Amazon search' },
            { key: 'Material', name: 'material', value: 'Reinforced Engineered Glass-Filled Nylon & Breathable Korean Mesh', required: true, note: 'Primary frame and seat construction' },
            { key: 'Fabric Type', name: 'fabric_type', value: 'High-Elasticity Air Permeable Mesh (Zero Heat Trapping)', required: true, note: 'Breathable seat and backrest textile' },
            { key: 'Size', name: 'size', value: 'Standard High-Back Executive', required: true, note: 'Size variation classifier' },
            { key: 'Item Shape', name: 'item_shape', value: 'Ergonomic S-Curve Spine Contour', required: false, note: 'Silhouette design' },
            { key: 'Care Instructions', name: 'care_instructions', value: 'Wipe with soft damp cloth; clean castors periodically; avoid direct exposure to harsh chemical solvents.', required: true, note: 'Mandatory customer guidance' },
            { key: 'Arm (Height) in cm', name: 'arm_height', value: '64.0 - 74.0 cm (Floor to Armrest Top)', required: true, note: 'Ensures clearance under standard office desks' },
            { key: 'Arm Style', name: 'arm_style', value: '2D Height-Adjustable Padded PU Armrests', required: true, note: 'Critical buyer filter (Shape, form, presence)' },
            { key: 'Fill Material', name: 'fill_material', value: '55D High-Density Virgin Cold-Cured Molded Foam', required: true, note: 'Cushion core filling material' },
            { key: 'Foldable?', name: 'is_foldable', value: 'No', required: true, note: 'Yes / No flag' },
            { key: 'Assembly Instructions', name: 'assembly_instructions', value: 'DIY 15-Minute Easy Assembly. Visual step-by-step graphic manual & Allen key toolkit included in box.', required: true, note: 'Crucial to prevent RTO returns' },
            { key: 'Unit Count', name: 'unit_count', value: '1.0 Count', required: true, note: 'Net quantity inside carton' },
            { key: 'Included Components', name: 'included_components', value: '1x High-Back Ergonomic Backrest, 1x Contoured Padded Seat, 2x Adjustable Armrests, 1x BIFMA Class-4 Gas Lift Cylinder, 1x Heavy-Duty 5-Star Nylon Base, 5x PU Caster Wheels, 1x Hardware Screw Kit & Allen Wrench, 1x User Manual', required: true, note: 'Helps customer inventory unboxing' },
            { key: 'Is Fragile?', name: 'is_fragile', value: 'No', required: true, note: 'Packaging handling tier' },
            { key: 'Back Style', name: 'back_style', value: 'High-Back Ergonomic Lumbar Cradle', required: true, note: 'Backrest shape category' },
            { key: 'Cushion Style', name: 'cushion_style', value: 'Waterfall Edge Pressure-Relief Contour', required: true, note: 'Prevents thigh numbness during long sitting' }
          ]
        },
        {
          id: 'ergonomics_seat',
          title: '3. Ergonomics, Seat Dimensions & Weight Ratings',
          icon: 'Gauge',
          attributes: [
            { key: 'Room Type', name: 'room_type', value: 'Home Office, Corporate Workspace, Study Room, Conference Area', required: true, note: 'Enables room-based filter indexing' },
            { key: 'Seat Back Interior Height', name: 'seat_back_interior_height', value: '72.0', required: true, note: 'Height from seat base to top headrest' },
            { key: 'Back Seat Interior Height Unit', name: 'seat_back_interior_height_unit', value: 'Centimeters (cm)', required: true, note: 'Standard SI metric unit' },
            { key: 'Seat Depth', name: 'seat_depth', value: '50.0 cm', required: true, note: 'Distance from front edge to back lumbar' },
            { key: 'Seat Height', name: 'seat_height', value: '45.0 - 55.0 cm (Pneumatic Adjustment)', required: true, note: 'Floor to top of seat cushion' },
            { key: 'Seat Length / Width', name: 'seat_length', value: '52.0 cm', required: true, note: 'Usable horizontal seating surface width' },
            { key: 'Seat Material', name: 'seat_material', value: 'High-Resilience Molded Foam Cushion with Anti-Sweat Mesh Fabric', required: true, note: 'Seat pan composite material' },
            { key: 'Max Weight Recommendation', name: 'maximum_weight_recommendation', value: '135 kg (300 lbs) Certified Load Capacity', required: true, note: 'BIFMA Class-4 tested static & dynamic weight' },
            { key: 'Furniture Leg Material', name: 'furniture_leg_material', value: 'Reinforced Heavy-Duty Engineered Nylon Spider Base', required: true, note: 'Base pedestal material' },
            { key: 'Legs Style', name: 'legs_style', value: '5-Star Base with 360° Frictionless 50mm Twin Caster Wheels', required: true, note: 'Floor contact & glide design' },
            { key: 'Seat Recline', name: 'seat_recline', value: '90° to 135° Multi-Position Synchro-Tilt with Locking Lever', required: true, note: 'Recline range & mechanism' },
            { key: 'Upholstery', name: 'upholstery', value: 'Premium Breathable Mesh & Micro-Perforated Fabric', required: true, note: 'Exterior skin material' },
            { key: 'Item Dimensions (D x W x H)', name: 'item_depth_width_height', value: '62.0 cm (D) x 64.0 cm (W) x 118.0 - 128.0 cm (H)', required: true, note: 'Exact assembled product footprint' },
            { key: 'Chair Backrest Width', name: 'chair_backrest_width', value: '48.0 cm', required: true, note: 'Shoulder-level backrest span' },
            { key: 'Assembly Adjustment', name: 'assembly_adjustment', value: 'Seat Height, Tilt Tension, Recline Lock, Armrest Height', required: true, note: 'User mechanical adjustability' },
            { key: 'Item Weight', name: 'item_weight', value: '14.5 kg', required: true, note: 'Net assembled product weight' }
          ]
        },
        {
          id: 'logistics_pricing',
          title: '4. Offer Pricing, Shipping & Package Dimensions',
          icon: 'DollarSign',
          attributes: [
            { key: 'Your Price (Selling Price)', name: 'standard_price', value: `₹${Number(sp).toLocaleString('en-IN')}`, required: true, note: 'Active buybox selling price' },
            { key: 'Maximum Retail Price (MRP)', name: 'list_price', value: `₹${Number(mrp).toLocaleString('en-IN')}`, required: true, note: 'Printed on carton box label' },
            { key: 'Packaging Dimensions (L x W x H)', name: 'package_dimensions', value: '68.0 cm (L) x 32.0 cm (W) x 60.0 cm (H)', required: true, note: 'Crucial for volumetric courier charges' },
            { key: 'Package Weight (Gross)', name: 'package_weight', value: '16.2 kg', required: true, note: 'Box shipping weight including packaging' }
          ]
        },
        {
          id: 'legal_compliance',
          title: '5. Legal Metrology Compliance (Mandatory in India)',
          icon: 'ShieldCheck',
          attributes: [
            { key: 'Manufacturer Contact Info', name: 'manufacturer_contact_information', value: `Manufactured by: ${cleanBrand} Seating Solutions Pvt. Ltd., Plot No. 42, Industrial Area Phase-2, New Delhi - 110020. Customer Care Email: support@${cleanBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com | Phone: +91-11-4920-1000`, required: true, note: 'Mandatory under Legal Metrology Act 2020' },
            { key: 'Packer Contact Info', name: 'packer_contact_information', value: `Packed by: ${cleanBrand} Central Fulfillment Logistics Hub, Khasra No. 18/2, Bilaspur Road, Gurugram, Haryana - 122413. Helpline: 1800-200-5588`, required: true, note: 'Mandatory for all e-commerce shipments' },
            { key: 'Country of Origin', name: 'country_of_origin', value: 'India', required: true, note: 'Made in India declaration' }
          ]
        },
        {
          id: 'warranty_policy',
          title: '6. Official Warranty & Claims Policy',
          icon: 'Sparkles',
          attributes: [
            { key: 'Warranty Period', name: 'warranty_period', value: '3 Years Comprehensive Brand Manufacturer Warranty', required: true, note: 'Drives buyer trust & boosts conversion' },
            { key: 'Warranty Terms & Conditions', name: 'warranty_terms', value: 'Covers all functional manufacturing defects in hydraulic gas-lift cylinder, tilt mechanism, base structure, and castors. Excludes normal cosmetic fabric wear & tear, cuts, burns, or physical abuse.', required: true, note: 'Protects seller from fraudulent claims' },
            { key: 'Steps to Avail Warranty', name: 'steps_to_avail_warranty', value: '1. WhatsApp purchase invoice and brief video of issue to official support (+91-98765-43210). 2. Technical team diagnoses via video within 2 hours. 3. Free replacement component dispatched via express courier with tool guidance.', required: true, note: 'Easy 3-step transparent resolution' },
            { key: 'Warranty Provider Contact', name: 'warranty_provider_contact', value: `${cleanBrand} Warranty Claims Cell, Email: warranty@${cleanBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com | Toll-Free: 1800-200-5588 (Mon-Sat, 9:30 AM - 6:30 PM)`, required: true, note: 'Official nodal warranty contact' }
          ]
        }
      ]
    };
  }

  // Generic / Adaptable E-Commerce Goods Profile
  return {
    categoryName: category || 'General E-Commerce Merchandise',
    productType: 'CONSUMER_GOODS',
    browseNode: 'General Retail',
    hsnCode: '99999999',
    sku: skuCode,
    sections: [
      {
        id: 'vital_info',
        title: '1. Vital Identity & Classification',
        icon: 'Tag',
        attributes: [
          { key: 'Item Name', name: 'item_name', value: cleanTitle, required: true, note: 'Paste in Amazon Vital Info' },
          { key: 'Brand Name', name: 'brand', value: cleanBrand, required: true, note: 'Registered brand name' },
          { key: 'Model No', name: 'model', value: modelNum, required: true, note: 'Catalog model code' },
          { key: 'SKU', name: 'sku', value: skuCode, required: true, note: 'Unique inventory code' }
        ]
      },
      {
        id: 'legal_compliance',
        title: '2. Legal Metrology Compliance',
        icon: 'ShieldCheck',
        attributes: [
          { key: 'Manufacturer Contact', name: 'manufacturer_contact_information', value: `Manufactured by: ${cleanBrand} Pvt. Ltd., India. Support: support@${cleanBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`, required: true, note: 'Legal Metrology compliance' },
          { key: 'Country of Origin', name: 'country_of_origin', value: 'India', required: true, note: 'Made in India' }
        ]
      },
      {
        id: 'warranty_policy',
        title: '3. Warranty Policy',
        icon: 'Sparkles',
        attributes: [
          { key: 'Warranty Period', name: 'warranty_period', value: '1 Year Manufacturer Warranty', required: true, note: 'Warranty period' },
          { key: 'Terms & Conditions', name: 'warranty_terms', value: 'Covers internal manufacturing defects. Excludes external physical damage.', required: true, note: 'Warranty terms' }
        ]
      }
    ]
  };
}

// Convert all attributes into Tab-Delimited text ready to paste directly into Amazon Excel Flat-File
export function exportAttributesToTSV(flatFileData) {
  if (!flatFileData?.sections) return '';
  const rows = [
    ['Attribute / Field Name', 'Amazon Feed Field Key', 'Recommended Value', 'Field Notes'].join('\t')
  ];

  for (const sec of flatFileData.sections) {
    rows.push([`=== ${sec.title.toUpperCase()} ===`, '', '', ''].join('\t'));
    for (const attr of sec.attributes) {
      rows.push([
        attr.key,
        attr.name,
        `"${String(attr.value).replace(/"/g, '""')}"`,
        attr.note || ''
      ].join('\t'));
    }
    rows.push(['', '', '', ''].join('\t'));
  }

  return rows.join('\n');
}

// Convert to CSV for 1-Click File Download
export function exportAttributesToCSV(flatFileData) {
  if (!flatFileData?.sections) return '';
  const rows = [
    ['Attribute / Field Name', 'Amazon Feed Field Key', 'Recommended Value', 'Required?', 'Field Notes'].map(c => `"${c}"`).join(',')
  ];

  for (const sec of flatFileData.sections) {
    rows.push([`=== ${sec.title.toUpperCase()} ===`, '', '', '', ''].map(c => `"${c}"`).join(','));
    for (const attr of sec.attributes) {
      rows.push([
        attr.key,
        attr.name,
        attr.value,
        attr.required ? 'Mandatory' : 'Optional',
        attr.note || ''
      ].map(c => `"${String(c).replace(/"/g, '""')}"`).join(','));
    }
  }

  return rows.join('\n');
}
