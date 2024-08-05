import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import * as e from "../style/styledreviewcheck1";

const Reviewcheck1 = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [reviews, setReviews] = useState([]);
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보를 위한 상태 추가
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // 리뷰 목록을 가져오는 함수
  const fetchReviews = async () => {
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
        "http://127.0.0.1:8000/api/myPage/recommended-products/",
        config
      );

      // 리뷰가 포함된 제품 목록을 설정
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      if (err.message === "No token found") {
        alert("토큰이 없습니다. 로그인이 필요합니다.");
        navigate("/login");
      } else if (err.response && err.response.status === 401) {
        console.error("Authentication error: Unauthorized");
        setError(new Error("인증 오류: 로그인이 필요합니다."));
      } else {
        console.error("An error occurred:", err.message);
        setError(err);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchReviews();
  }, [navigate]);

  const goMain0 = () => {
    navigate(`/Main0`);
  };

  const goMain2 = () => {
    navigate(`/Main2`);
  };

  const goReview = () => {
    navigate(`/Review`);
  };

  const goReviewcheck2 = (review) => {
    navigate(`/Reviewcheck2`, { state: review });
  };

  const goMypage = () => {
    navigate(`/Mypage`);
  };

  const goLogin = () => {
    navigate(`/Login`);
  };

  const goAlarm1 = () => {
    navigate(`/Alarm1`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <e.Container>
      <e.Header>
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
        <e.Border>
          <div></div>
        </e.Border>
      </e.Header>

      {isMenuOpen && (
        <>
          <e.Backdrop onClick={closeMenu} />
          <e.DropdownMenu>
            <e.DropdownItem onClick={goMypage}>
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
            </e.DropdownItem>
            <e.DropdownItem onClick={goReview}>
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
            </e.DropdownItem>
            <e.DropdownItem onClick={goMain0}>
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
            </e.DropdownItem>
            <e.DropdownItem onClick={goLogin}>
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
            </e.DropdownItem>
          </e.DropdownMenu>
        </>
      )}

      <e.Ybox>
        <e.Top>나의 리뷰 확인하기</e.Top>
      </e.Ybox>

      <e.Body>
        {reviews.map((review, index) => (
          <e.Box key={index}>
            <e.Box2>
              <e.Keywordd
                onClick={() => goReviewcheck2(review)}
                style={{ cursor: "pointer" }}
              >
                <e.SmallBox5>
                  <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                    [{review.product_name}]
                  </span>
                  <span style={{ fontSize: "13px" }}>
                    {review.review || "리뷰가 없습니다."}
                  </span>
                  <e.Click type={review.GNB}>
                    {review.GNB === "G" && (
                      <img
                        id="review-image"
                        src="/static/logo/good2.png"
                        alt="good"
                      />
                    )}
                    {review.GNB === "B" && (
                      <img
                        id="review-image"
                        src="/static/logo/bad2.png"
                        alt="bad"
                      />
                    )}
                  </e.Click>
                </e.SmallBox5>
              </e.Keywordd>
            </e.Box2>
          </e.Box>
        ))}

        {/* <e.Button onClick={goReview}>
          <e.ButtonText>새로운 리뷰 작성하기</e.ButtonText>
        </e.Button> */}
      </e.Body>
    </e.Container>
  );
};

export default Reviewcheck1;
