import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { getFirestoreDocuments } from "../utils/Firebase";
import LoadingImage from "../images/loading.gif";
import AllArticlesItem from "../components/AllArticlesItem";

const CategoryBlock = styled.div`
  width: 85%;
  margin: 0.5rem 0;
`;

const CategoryRedLine = styled.div`
  width: 100%;
  height: 9px;
  margin: 0.7rem 0;
  background-color: #ff0000;

  @media (max-width: 480px) {
    height: 6.5px;
    margin: 0.4rem 0;
  }
`;

const ItemSection = styled.div`
  width: 100%;
  height: 70%;
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 352px) {
    justify-content: center;
  }
`;

const Label = styled.h2`
  color: #333333;
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const CategorySection = ({ label }) => {
  const [allSpots, setAllSpots] = useState([]);

  const getData = async () => {
    try {
      let allSpotsArray = [];
      const querySnapshot = await getFirestoreDocuments("Spots");
      querySnapshot.forEach((doc) => {
        allSpotsArray.push(doc.data());
      });
      setAllSpots(allSpotsArray);
    } catch {
      Swal.fire({
        icon: "error",
        title: "讀取資料時發生錯誤",
        confirmButtonText: "回首頁",
        confirmButtonColor: "#3085d6",
        // footer: '<a href="">回報問題</a>',
      }).then(() => {
        window.location = "/";
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <CategoryBlock>
      <Label>{label}</Label>
      <CategoryRedLine />
      {!allSpots && <img src={LoadingImage} />}
      <ItemSection>
        {allSpots
          .filter((item) => item.category === label)
          .map((item) => (
            <AllArticlesItem
              key={item.title}
              title={item.title}
              image={item.article_image}
            />
          ))}
      </ItemSection>
    </CategoryBlock>
  );
};

export default CategorySection;
