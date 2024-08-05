import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import * as v from "../style/styledreviewcheck2";

const Reviewcheck2 = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { product, review, selectedImage } = location.state || {};
  const [productData, setProductData] = useState(null);
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보를 위한 상태 추가
  const [showPopup, setShowPopup] = useState(false);

  const goMain2 = () => {
    navigate(`/Main2`);
  };

  const goMain0 = () => {
    navigate(`/Main0`);
  };

  const goMypage = () => {
    navigate(`/Mypage`);
  };

  const goReview = () => {
    navigate(`/Review`);
  };

  const goLogin = () => {
    navigate(`/Login`);
  };

  const goAlarm1 = () => {
    navigate(`/Alarm1`);
  };

  const goReviewcheck1 = () => {
    navigate(`/Reviewcheck1`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // 사용자 정보를 가져오는 함수
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token"); // 로그인 후 저장된 토큰을 가져옵니다.
      const response = await axios.get(
        "http://127.0.0.1:8000/api/myPage/profile/",
        {
          headers: {
            Authorization: `Token ${token}`, // Authorization 헤더에 토큰을 포함합니다.
          },
        }
      );
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      if (product) {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No token found");
          }

          const config = {
            headers: {
              Authorization: `Token ${token}`,
            },
          };

          const response = await axios.get(
            `http://127.0.0.1:8000/api/myPage/recommended-products/${product.id}/`,
            config
          );
          setProductData(response.data);
        } catch (err) {
          if (err.message === "No token found") {
            alert("토큰이 없습니다. 로그인이 필요합니다.");
            navigate("/login");
          } else {
            console.error("An error occurred:", err.message);
          }
        }
      }
    };

    fetchProductData();
  }, [product, navigate]);

  // 리뷰 수정하기 버튼 함수
  // const goReviewcheck3 = () => {
  //   if (product && review) {
  //     navigate(`/Reviewcheck3`, { state: { product, review, selectedImage } });
  //   } else {
  //     setShowPopup(true);
  //   }
  // };

  return (
    <v.Container>
      {showPopup && (
        <v.Popup>
          <v.PopupContent>
            <p>제품 정보나 리뷰가 없습니다.</p>
            <v.PopupButton onClick={goReview}>리뷰 작성하기</v.PopupButton>
          </v.PopupContent>
        </v.Popup>
      )}
      <v.Header>
        <img
          id="back"
          src="/static/logo/backbtn.svg"
          alt="back button"
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            cursor: "pointer",
          }}
          onClick={() => navigate(-1)}
        />
        <img
          id="logo"
          src="/static/logo/ylogo.svg"
          alt="logo"
          width="40px"
          onClick={goMain2}
        />
        <img
          id="alarm"
          src="/static/logo/alarm.svg"
          alt="alarm button"
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            cursor: "pointer",
          }}
          onClick={goAlarm1}
        />
        <img
          id="menu"
          src="/static/logo/menu.svg"
          alt="menu button"
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            cursor: "pointer",
          }}
          onClick={toggleMenu}
        />
        <v.Border>
          <div></div>
        </v.Border>
      </v.Header>

      {isMenuOpen && (
        <>
          <v.Backdrop onClick={closeMenu} />
          <v.DropdownMenu>
            <v.DropdownItem onClick={goMypage}>
              <img
                id="mypage"
                src="/static/logo/mypage.svg"
                alt="mypage"
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  cursor: "pointer",
                }}
                onClick={toggleMenu}
              />
            </v.DropdownItem>
            <v.DropdownItem onClick={goReview}>
              <img
                id="myreview"
                src="/static/logo/myreview.svg"
                alt="myreview"
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  cursor: "pointer",
                }}
                onClick={toggleMenu}
              />
            </v.DropdownItem>
            <v.DropdownItem onClick={goMain0}>
              <img
                id="mainpage"
                src="/static/logo/mainpage.svg"
                alt="mainpage"
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  cursor: "pointer",
                }}
                onClick={toggleMenu}
              />
            </v.DropdownItem>
            <v.DropdownItem onClick={goLogin}>
              <img
                id="logout"
                src="/static/logo/logout.svg"
                alt="logout"
                style={{
                  position: "absolute",
                  right: "8px",
                  cursor: "pointer",
                }}
                onClick={toggleMenu}
              />
            </v.DropdownItem>
          </v.DropdownMenu>
        </>
      )}

      <v.Ybox>
        <v.Top>{userInfo ? `${userInfo.first_name}님!` : "사용자님!"}</v.Top>
        <v.Click>
          {selectedImage === "good" && (
            <img
              id="review-image"
              src="/static/logo/good2.png"
              alt="good"
              width="95px"
            />
          )}
          {selectedImage === "bad" && (
            <img
              id="review-image"
              src="/static/logo/bad2.png"
              alt="bad"
              width="95px"
            />
          )}
        </v.Click>
      </v.Ybox>

      <v.Body>
        <v.Box>
          <v.Box2>
            <v.Keywordd key={product?.id}>
              <v.SmallBox5>
                <span style={{ fontSize: "13px" }}>{review}</span>
              </v.SmallBox5>
            </v.Keywordd>
          </v.Box2>
        </v.Box>

        <v.Button onClick={goReviewcheck1}>
          <v.ButtonText>나의 리뷰 확인하기</v.ButtonText>
        </v.Button>
      </v.Body>
    </v.Container>
  );
};

export default Reviewcheck2;
