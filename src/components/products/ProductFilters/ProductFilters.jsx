import React, { useState, useEffect } from "react";
import {
  Card,
  Slider,
  Checkbox,
  Radio,
  Button,
  Space,
  Collapse,
  InputNumber,
  Tag,
  Spin,
} from "antd";
import {
  FilterOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import vehicleModelService from "../../../services/vehicleModelService";
import batteryModelService from "../../../services/batteryModelService";
import postService from "../../../services/postService";
import styles from "./ProductFilters.module.css";

const { Panel } = Collapse;

const ProductFilters = ({ onFilterChange, onResetFilters }) => {
  const [priceRange, setPriceRange] = useState([0, 1500000000]); // 0 - 1,500 triệu VND
  const [capacityRange, setCapacityRange] = useState([0, 100]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // State cho filter options từ API
  const [brands, setBrands] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Static filter options (không thay đổi)
  const conditions = [
    { label: "Xuất sắc", value: "Excellent", color: "green" },
    { label: "Rất tốt", value: "Very Good", color: "blue" },
    { label: "Tốt", value: "Good", color: "cyan" },
    { label: "Khá", value: "Fair", color: "orange" },
  ];

  const productCategories = [
    { 
      label: "Pin EV", 
      value: "battery",
      icon: "🔋",
      color: "#52c41a",
      description: "Pin xe điện"
    },
    { 
      label: "Xe ô tô điện", 
      value: "car",
      icon: "🚗",
      color: "#722ed1",
      description: "Ô tô điện"
    },
  ];

  // Fetch filter options từ API
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    setLoading(true);
    try {
      // Fetch brands từ vehicle models và battery models
      const [vehicleFilters, batteryFilters, posts] = await Promise.all([
        vehicleModelService.getAllFilters().catch(() => ({ brands: [] })),
        batteryModelService.getAllFilters().catch(() => ({ brands: [] })),
        postService.getPosts({ pageSize: 1000 }).catch(() => [])
      ]);

      // Combine brands từ cả vehicle và battery
      const vehicleBrands = vehicleFilters.brands || [];
      const batteryBrands = batteryFilters.brands || [];
      const allBrands = [...new Set([...vehicleBrands, ...batteryBrands])];
      
      // Sort alphabetically
      const sortedBrands = allBrands
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, 'vi'))
        .map(brand => ({
          label: brand,
          value: brand.toLowerCase()
        }));
      
      setBrands(sortedBrands);

      // Extract unique locations từ posts
      const postsArray = Array.isArray(posts) ? posts : posts.data || posts.items || [];
      const uniqueLocations = [...new Set(
        postsArray
          .map(post => post.member?.address)
          .filter(Boolean)
          .map(addr => {
            // Extract city from address
            const match = addr.match(/TP\.\s*[^,]+|Hà Nội|Đà Nẵng|Cần Thơ|Hải Phòng|[^,]+$/i);
            return match ? match[0].trim() : null;
          })
          .filter(Boolean)
      )];

      // Sort alphabetically
      const sortedLocations = uniqueLocations
        .sort((a, b) => a.localeCompare(b, 'vi'))
        .map(loc => ({
          label: loc,
          value: loc
        }));

      setLocations(sortedLocations);

      console.log('✅ Filter options loaded:', {
        brands: sortedBrands.length,
        locations: sortedLocations.length
      });
    } catch (error) {
      console.error('❌ Error fetching filter options:', error);
      // Set empty arrays on error
      setBrands([]);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    const filters = {
      priceRange,
      capacityRange,
      brands: selectedBrands,
      conditions: selectedConditions,
      locations: selectedLocations,
      categories: selectedCategories,
    };
    onFilterChange(filters);
  };

  const handleReset = () => {
    setPriceRange([0, 1500000000]);
    setCapacityRange([0, 100]);
    setSelectedBrands([]);
    setSelectedConditions([]);
    setSelectedLocations([]);
    setSelectedCategories([]);
    onResetFilters();
  };

  const activeFiltersCount = 
    selectedBrands.length +
    selectedConditions.length +
    selectedLocations.length +
    selectedCategories.length;

  return (
    <Card className={styles.filtersCard}>
      <div className={styles.filterHeader}>
        <div>
          <h3 className={styles.filterTitle}>
            <FilterOutlined /> Bộ lọc
            {activeFiltersCount > 0 && (
              <Tag color="blue" style={{ marginLeft: 8 }}>
                {activeFiltersCount}
              </Tag>
            )}
          </h3>
        </div>
        <Space>
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined spin={loading} />}
            onClick={fetchFilterOptions}
            disabled={loading}
            title="Tải lại bộ lọc"
          />
        </Space>
      </div>

      <Collapse
        defaultActiveKey={["category", "price", "capacity", "brands", "membership", "location", "condition"]}
        ghost
        expandIconPosition="end"
      >
        {/* Product Categories */}
        <Panel header={<span className={styles.panelHeader}>📦 Loại sản phẩm</span>} key="category">
          <Checkbox.Group
            value={selectedCategories}
            onChange={setSelectedCategories}
            className={styles.checkboxGroup}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {productCategories.map((category) => (
                <div key={category.value} className={styles.categoryItem}>
                  <Checkbox value={category.value}>
                    <div className={styles.categoryContent}>
                      <span className={styles.categoryIcon}>{category.icon}</span>
                      <div className={styles.categoryInfo}>
                        <span className={styles.categoryLabel} style={{ color: category.color }}>
                          {category.label}
                        </span>
                        <span className={styles.categoryDesc}>{category.description}</span>
                      </div>
                    </div>
                  </Checkbox>
                </div>
              ))}
            </Space>
          </Checkbox.Group>
        </Panel>

        {/* Price Range */}
        <Panel header={<span className={styles.panelHeader}><DollarOutlined /> Khoảng giá</span>} key="price">
          <div className={styles.rangeFilter}>
            <Slider
              range
              min={0}
              max={99999999999}
              step={50000000}
              value={priceRange}
              onChange={setPriceRange}
              tooltip={{ formatter: (value) => `${(value / 1000000).toFixed(0)}tr ₫` }}
            />
            <div className={styles.rangeInputs}>
              <InputNumber
                addonAfter="₫"
                value={priceRange[0]}
                onChange={(value) => setPriceRange([value, priceRange[1]])}
                min={0}
                max={priceRange[1]}
                style={{ width: "100%" }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
              <span>—</span>
              <InputNumber
                addonAfter="₫"
                value={priceRange[1]}
                onChange={(value) => setPriceRange([priceRange[0], value])}
                min={priceRange[0]}
                max={1500000000}
                style={{ width: "100%" }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </div>
          </div>
        </Panel>

        {/* Capacity Range */}
        <Panel header={<span className={styles.panelHeader}><ThunderboltOutlined /> Dung lượng (kWh)</span>} key="capacity">
          <div className={styles.rangeFilter}>
            <Slider
              range
              min={0}
              max={100}
              step={5}
              value={capacityRange}
              onChange={setCapacityRange}
              tooltip={{ formatter: (value) => `${value} kWh` }}
            />
            <div className={styles.rangeInputs}>
              <InputNumber
                suffix="kWh"
                value={capacityRange[0]}
                onChange={(value) => setCapacityRange([value, capacityRange[1]])}
                min={0}
                max={capacityRange[1]}
                style={{ width: "100%" }}
              />
              <span>—</span>
              <InputNumber
                suffix="kWh"
                value={capacityRange[1]}
                onChange={(value) => setCapacityRange([capacityRange[0], value])}
                min={capacityRange[0]}
                max={100}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </Panel>

        {/* Brands */}
        <Panel header={<span className={styles.panelHeader}>🚗 Thương hiệu</span>} key="brands">
          <Checkbox.Group
            value={selectedBrands}
            onChange={setSelectedBrands}
            className={styles.checkboxGroup}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {brands.map((brand) => (
                <div key={brand.value} className={styles.checkboxItem}>
                  <Checkbox value={brand.value}>{brand.label}</Checkbox>
                </div>
              ))}
            </Space>
          </Checkbox.Group>
        </Panel>

        {/* Locations */}
        <Panel header={<span className={styles.panelHeader}>📍 Khu vực</span>} key="location">
          <Checkbox.Group
            value={selectedLocations}
            onChange={setSelectedLocations}
            className={styles.checkboxGroup}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {locations.map((location) => (
                <div key={location.value} className={styles.checkboxItem}>
                  <Checkbox value={location.value}>{location.label}</Checkbox>
                </div>
              ))}
            </Space>
          </Checkbox.Group>
        </Panel>

        {/* Condition */}
        <Panel header={<span className={styles.panelHeader}>✨ Tình trạng</span>} key="condition">
          <Checkbox.Group
            value={selectedConditions}
            onChange={setSelectedConditions}
            className={styles.checkboxGroup}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {conditions.map((condition) => (
                <div key={condition.value} className={styles.checkboxItem}>
                  <Checkbox value={condition.value}>
                    <Tag color={condition.color}>{condition.label}</Tag>
                  </Checkbox>
                </div>
              ))}
            </Space>
          </Checkbox.Group>
        </Panel>
      </Collapse>

      <div className={styles.filterActions}>
        <Button
          type="primary"
          icon={<FilterOutlined />}
          block
          size="large"
          onClick={handleApplyFilters}
          className={styles.applyButton}
        >
          Áp dụng bộ lọc
        </Button>
        <Button
          icon={<ReloadOutlined />}
          block
          onClick={handleReset}
          className={styles.resetButton}
        >
          Đặt lại tất cả
        </Button>
      </div>
    </Card>
  );
};

export default ProductFilters;
