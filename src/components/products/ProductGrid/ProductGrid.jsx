import React from "react";
import { Row, Col, Pagination, Select, Empty, Spin } from "antd";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductGrid.module.css";

const { Option } = Select;

const ProductGrid = ({
  products = [],
  loading = false,
  currentPage = 1,
  pageSize = 12,
  total = 0,
  onPageChange,
  onPageSizeChange,
  sortBy = "featured",
  onSortChange,
  viewMode = "grid",
  onViewModeChange,
  onViewDetails,
  onAddToCart,
  onContactVehicle,
}) => {
  const sortOptions = [
    { label: "Nổi bật", value: "featured" },
    { label: "Giá: Thấp đến cao", value: "price-asc" },
    { label: "Giá: Cao đến thấp", value: "price-desc" },
    { label: "Đánh giá cao nhất", value: "rating" },
    { label: "Mới nhất", value: "newest" },
    { label: "Phổ biến nhất", value: "popular" },
  ];

  const handlePaginationChange = (page, newPageSize) => {
    if (newPageSize !== pageSize) {
      onPageSizeChange(newPageSize);
    }
    onPageChange(page);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không tìm thấy sản phẩm"
          style={{ marginTop: 60 }}
        />
      </div>
    );
  }

  return (
    <div className={styles.productGrid}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.resultsInfo}>
          <span className={styles.resultsCount}>
            Hiển thị {(currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, total)} trong số {total} sản phẩm
          </span>
        </div>

        <div className={styles.toolbarActions}>
          {/* Sort Select */}
          <Select
            value={sortBy}
            onChange={onSortChange}
            style={{ width: 180 }}
            className={styles.sortSelect}
          >
            {sortOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>

          {/* View Mode Toggle */}
          <div className={styles.viewModeToggle}>
            <button
              className={`${styles.viewModeBtn} ${
                viewMode === "grid" ? styles.active : ""
              }`}
              onClick={() => onViewModeChange("grid")}
            >
              <AppstoreOutlined />
            </button>
            <button
              className={`${styles.viewModeBtn} ${
                viewMode === "list" ? styles.active : ""
              }`}
              onClick={() => onViewModeChange("list")}
            >
              <UnorderedListOutlined />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <Row gutter={[24, 24]} className={styles.productsRow}>
        {products.map((product) => (
          <Col
            key={product.id}
            xs={24}
            sm={viewMode === "list" ? 24 : 12}
            md={viewMode === "list" ? 24 : 8}
            lg={viewMode === "list" ? 24 : 8}
            xl={viewMode === "list" ? 24 : 8}
            xxl={viewMode === "list" ? 24 : 8}
          >
            <ProductCard 
              product={product} 
              viewMode={viewMode}
              onViewDetails={onViewDetails}
              onAddToCart={onAddToCart}
              onContactVehicle={onContactVehicle}
            />
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      {total > pageSize && (
        <div className={styles.paginationContainer}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePaginationChange}
            onShowSizeChange={handlePaginationChange}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={["12", "24", "36", "48"]}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} trong ${total} sản phẩm`
            }
            className={styles.pagination}
          />
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
