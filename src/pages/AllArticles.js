import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/Firebase";
import styled from "styled-components";
import { FaEdit } from "react-icons/fa";
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import LoadingImage from "../images/loading.gif";
import AllArticlesItem from "../components/AllArticlesItem";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TopIcon from "../images/top.png";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const TopButton = styled.div`
  width: 100px;
  height: 100px;
  background-image: url(${TopIcon});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: fixed;
  bottom: 50px;
  right: 30px;
  cursor: pointer;

  @media (max-width: 1100px) {
    width: 80px;
    height: 80px;
  }

  @media (max-width: 850px) {
    width: 60px;
    height: 60px;
    bottom: 30px;
    left: 20px;
  }

  &:hover {
    animation: shake 0.82s cubic-bezier(0.30, 0.07, 0.19, 0.97) both;
  }

  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1.5px, 0px, 0);
    }
    20%, 80% {
      transform: translate3d(0, 1.5px, 0);
    }
    
    30%, 50%, 70% {
      transform: translate3d(-1.5px, 0, 0);
    }
    40%, 60% {
      transform: translate3d(0, 1.5px, 0);
  }
`;

const BodyContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleContainer = styled.div`
  width: 85%;
  display: flex;
  margin: 2rem 0;
  justify-content: space-between;
  align-items: end;

  @media (max-width: 1300px) {
    margin: 1.5rem 0;
  }

  @media (max-width: 480px) {
    margin: 1rem 0;
  }

  @media (max-width: 450px) {
    margin: 0.6rem 0;
  }
`;

const Title = styled.div`
  font-size: 3.5rem;
  font-weight: 800;

  @media (max-width: 1300px) {
    font-size: 3rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }

  @media (max-width: 370px) {
    font-size: 2.3rem;
  }
`;

const EditSection = styled(Link)`
  display: flex;
  align-items: end;
  height: auto;
  width: auto;
  text-decoration: none;
`;

const EditIcon = styled(FaEdit)`
  width: 50px;
  height: 50px;
  color: #616161;

  @media (max-width: 1300px) {
    width: 40px;
    height: 40px;
  }
  @media (max-width: 450px) {
    width: 35px;
    height: 35px;
  }
`;

const EditWords = styled.h3`
  margin: 0 0 0 0.5rem;
  font-size: 2rem;
  color: #616161;

  @media (max-width: 1300px) {
    font-size: 1.5rem;
  }

  @media (max-width: 650px) {
    display: none;
  }
`;

const CategoryBlock = styled.div`
  width: 85%;
  margin: 1.5rem;

  @media (max-width: 450px) {
    margin: 0.5rem;
  }
`;

const CategoryRedLine = styled.div`
  width: 100%;
  height: 18px;
  margin: 0.7rem 0;
  background-color: #ff0000;

  @media (max-width: 480px) {
    height: 12px;
  }
`;

const ItemSection = styled.div`
  width: 100%;
  height: 70%;
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 702px) {
    justify-content: center;
  }
`;

const Label = styled.h2`
  margin: 0;
  font-size: 2rem;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 1.7rem;
  }
`;

initializeApp(firebaseConfig);
const db = getFirestore();

let localId;

const AllArticles = () => {
  const [allSpots, setAllSpots] = useState([]);
  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  const getData = async () => {
    try {
      let allSpotsArray = [];
      const querySnapshot = await getDocs(collection(db, "Spots"));
      querySnapshot.forEach((doc) => {
        allSpotsArray.push(doc.data());
      });
      setAllSpots(allSpotsArray);
    } catch (e) {
      console.error("Error getting document: ", e);
    }
  };

  useEffect(() => {
    window.scroll({ top: 0, behavior: "smooth" });
    getData();
  }, []);

  const newPostHandler = async () => {
    if (!localId) {
      alert("請先登入");
    }
  };

  return (
    <>
      <Header />
      <BodyContainer>
        <TitleContainer>
          <Title>所有文章</Title>
          <EditSection
            onClick={newPostHandler}
            to={"/new-post"}
            title={"發表文章"}
          >
            <EditIcon />
            <EditWords>發表文章</EditWords>
          </EditSection>
        </TitleContainer>
        <CategoryBlock>
          <Label>博物館</Label>
          <CategoryRedLine />
          {!allSpots && <img src={LoadingImage} />}
          <ItemSection>
            {allSpots
              .filter((item) => item.category === "博物館")
              .map((item) => (
                <AllArticlesItem
                  key={item.title}
                  title={item.title}
                  image={item.image}
                />
              ))}
          </ItemSection>
        </CategoryBlock>
        <CategoryBlock>
          <Label>自然景觀</Label>
          <CategoryRedLine />
          {!allSpots && <img src={LoadingImage} />}
          <ItemSection>
            {allSpots
              .filter((item) => item.category === "自然景觀")
              .map((item) => (
                <AllArticlesItem
                  key={item.title}
                  title={item.title}
                  image={item.image}
                />
              ))}
          </ItemSection>
        </CategoryBlock>
        <CategoryBlock>
          <Label>餐廳</Label>
          <CategoryRedLine />
          {!allSpots && <img src={LoadingImage} />}
          <ItemSection>
            {allSpots
              .filter((item) => item.category === "餐廳")
              .map((item) => (
                <AllArticlesItem
                  key={item.title}
                  title={item.title}
                  image={item.image}
                />
              ))}
          </ItemSection>
        </CategoryBlock>
        <CategoryBlock>
          <Label>聖誕主題</Label>
          <CategoryRedLine />
          {!allSpots && <img src={LoadingImage} />}
          <ItemSection>
            {allSpots
              .filter((item) => item.category === "聖誕主題")
              .map((item) => (
                <AllArticlesItem
                  key={item.title}
                  title={item.title}
                  image={item.image}
                />
              ))}
          </ItemSection>
        </CategoryBlock>
        <CategoryBlock>
          <Label>購物</Label>
          <CategoryRedLine />
          {!allSpots && <img src={LoadingImage} />}
          <ItemSection>
            {allSpots
              .filter((item) => item.category === "購物")
              .map((item) => (
                <AllArticlesItem
                  key={item.title}
                  title={item.title}
                  image={item.image}
                />
              ))}
          </ItemSection>
        </CategoryBlock>
        <CategoryBlock>
          <Label>交通</Label>
          <CategoryRedLine />
          {!allSpots && <img src={LoadingImage} />}
          <ItemSection>
            {allSpots
              .filter((item) => item.category === "交通")
              .map((item) => (
                <AllArticlesItem
                  key={item.title}
                  title={item.title}
                  image={item.image}
                />
              ))}
          </ItemSection>
        </CategoryBlock>
      </BodyContainer>
      <TopButton
        onClick={() => {
          window.scroll({ top: 0, behavior: "smooth" });
        }}
      />
      <Footer />
    </>
  );
};

export default AllArticles;
