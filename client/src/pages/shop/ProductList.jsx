import { useState, useEffect } from "react";
import Card from "../../components/Card";
import useAxiosPublic from "../../hook/useAxiosPublic";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filterItems, setFilterItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOptions] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [categories, setCategories] = useState([]);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get("http://localhost:4000/products");
        // const data = await response.json();
        const response = await axiosPublic.get("/products");
        const data = response.data;
        setProducts(data);
        setFilterItems(data);
        setCategories([
          "all",
          ...new Set(data.map((item) => item.category)), // ใช้ new Set() ไม่ใช่ new setCategories()
        ]);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filterItem = (category) => {
    const filtered =
      category === "all"
        ? products
        : products.filter((item) => item.category === category);
    // setFilterItems(filtered);
    handleSortChange(sortOption, filtered);
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (option, products) => {
    setSortOptions(option); // ใช้ setSortOptions() เพื่ออัพเดตค่า sortOption
    let sortedItems = [...products];
    switch (option) {
      case "A-Z":
        sortedItems.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Z-A":
        sortedItems.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "low-to-high":
        sortedItems.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        sortedItems.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilterItems(sortedItems);
    setCurrentPage(1);
  };

  const indexofLastItem = itemsPerPage * currentPage;
  const indexofFirstItem = indexofLastItem - itemsPerPage;
  const currentItems = filterItems.slice(indexofFirstItem, indexofLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {/** ProductList Banner */}
      <div className="section-container bg gradient-to-r from-[#FAFAFA] from-0% to-[#FCFCFC] to-100%">
        <div className="py-48 flex flex-col justify-center items-center">
          <h2 className="md:text-4xl text-4xl font-bold md:leading-snug leading-snug text-center ">
            Unleash Your Inner <span className="text-red-500">Geek</span>:{" "}
            <br /> Shop Our Exclusive Tech-themed Merchandise!
          </h2>
          <p className="text-xl text-[#AAAAAA]">
            Our mission: To merge fashion with functionality in the world of
            Software Engineering
          </p>
          <button className="btn bg-red-500 px-8 py-3 font-semibold text-white rounded-full">
            Order Now
          </button>
        </div>
      </div>
      {/**Product List card */}
      <div className="section-container">
        <div className="flex flex-col md:flex-row flex-wrap md:justify-between items-center space-y-3 mb-8">
          <div className="flex flex-row justify-start md:items-center md:gap-8 gap-4 flex-wrap">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => filterItem(category)}
                className={`${
                  selectedCategory === category ? "active" : ""
                } px-4 py-2 rounded-full`}
              >
                <p className="capitalize">{category}</p>
              </button>
            ))}
          </div>
        </div>
        {/**Sort Option*/}
        <div className="flex justify-end mb-4 rounded-sm">
          <div className="bg-black p-2">
            <select
              id="sort"
              className="bg-black text-white px-2 rounded-sm"
              onChange={(e) => handleSortChange(e.target.value, filterItems)}
              value={sortOption}
            >
              <option value={"default"}>default</option>
              <option value={"A-Z"}>A-Z</option>
              <option value={"Z-A"}>Z-A</option>
              <option value={"low-to-high"}>low-to-high</option>
              <option value={"high-to-low"}>high-to-low</option>
            </select>
          </div>
        </div>
        {/**Product Card */}
        <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
          {currentItems.map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </div>
      </div>
      {/** Pegination */}
      <div className="flex justify-center my-8 flex-wrap gap-2">
        {Array.from({
          length: Math.ceil(filterItems.length / itemsPerPage),
        }).map((_, index) => {
          return (
            <button
              key={index}
              className={`mx-1 px-3 py-1 rounded-full ${
                currentPage === index +1
                  ? "bg-red-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => {
                paginate(index+1);
              }}
            >{index + 1}</button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
