import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as l from "../style/styledmain2";

const Main2 = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userError, setUserError] = useState(null);

  const goMypage = () => {
    navigate(`/Mypage`);
  };

  const goMyreview = () => {
    navigate(`/Review`);
  };

  const goLogin = () => {
    navigate(`/Login`);
  };

  const goAlarm1 = () => {
    navigate(`/Alarm1`);
  };

  const goMain2 = () => {
    navigate(`/Main2`);
  };

  const goMain0 = () => {
    navigate(`/Main0`);
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
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("로그인 토큰이 없습니다.");
      }

      const response = await axios.get(
        "http://127.0.0.1:8000/api/myPage/profile/",
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("서버 응답:", response);

      if (response.headers["content-type"].includes("application/json")) {
        console.log("사용자 정보:", response.data);
        setUserInfo(response.data);
      } else {
        throw new Error("서버가 JSON 응답을 반환하지 않았습니다.");
      }
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error.message);
      setUserError(error.message);
    }
  };

  const diseaseMapping = {
    diabetes: "당뇨",
    obesity: "비만",
    muscle_loss: "근손실",
    hypertension: "고혈압",
  };

  // 사용자 정보에서 질병 이름을 변환
  const getDiseaseName = (diseaseKey) => {
    return diseaseMapping[diseaseKey] || diseaseKey;
  };

  // 컴포넌트가 마운트될 때 사용자 정보를 가져옵니다.
  useEffect(() => {
    fetchUserInfo();
    checkCartStatus(); // 페이지 로드 시 카트 상태 확인
  }, []);

  // 나머지 상태 및 함수 정의
  const [box2Items, setBox2Items] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [list2Items, setList2Items] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartError, setCartError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
      "X-CSRFToken": localStorage.getItem("csrftoken") || "",
    },
  });

  // 카트 상태 서버와 연동
  const checkCartStatus = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("customFit/cart/");
      console.log("현재 카트 상태:", response.data);
      const cartItems = response.data.map((item) => item.product);
      setBox2Items(cartItems);
      setSelectedItems(cartItems); // 여기에 selectedItems도 업데이트
      if (response.data.length === 0) {
        console.log("카트가 비어 있습니다.");
      } else {
        console.log("카트에 상품이 있습니다.");
      }
    } catch (error) {
      console.error("카트 상태 확인 중 오류 발생:", error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // 상품 추가 또는 삭제 시 checkCartStatus 호출해 상태 업데이트
  const toggleCheckbox = async (item) => {
    const isSelected = selectedItems.some(
      (selectedItem) => selectedItem.product_id === item.product_id
    );

    if (isSelected) {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((i) => i.product_id !== item.product_id)
      );

      try {
        await removeFromCart(item.product_id);
        console.log(
          `상품 ID ${item.product_id}이(가) 카트에서 삭제되었습니다.`
        );
        await checkCartStatus(); // 카트 상태 체크
      } catch (error) {
        console.error("카트에서 삭제 중 오류 발생:", error.message);
        setError(error);
      }
    } else {
      if (box2Items.length >= 5) {
        alert("카트에 담을 수 있는 최대 상품 수는 5개입니다.");
        return;
      }
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item]);

      try {
        await addToCart(item.product_id);
        console.log(`상품 ID ${item.product_id}이(가) 카트에 추가되었습니다.`);
        await checkCartStatus(); // 카트 상태 체크
      } catch (error) {
        console.error("카트 추가 중 오류 발생:", error.message);
        setError(error);
      }
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("customFit/search/", {
        params: { product_name: searchQuery },
      });
      setList2Items(response.data);
    } catch (error) {
      console.error("검색 중 오류 발생:", error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // 상품 추가
  const addToCart = async (product_id) => {
    try {
      const response = await axiosInstance.post(
        `customFit/add_cart/${product_id}/`,
        {},
        {
          headers: {
            "X-CSRFToken": localStorage.getItem("csrftoken") || "",
          },
        }
      );
      console.log("API 응답:", response.data);
      console.log(`상품 ID ${product_id}이(가) 카트에 추가되었습니다.`);
      await checkCartStatus(); // 카트 상태 체크
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error;
        console.error("카트 추가 중 오류 발생:", errorMessage);
        if (errorMessage === "카트에 담을 수 있는 최대 상품 수는 5개입니다.") {
          alert("카트에 담을 수 있는 최대 상품 수는 5개입니다.");
        } else {
          setError(errorMessage);
        }
      } else {
        console.error("카트 추가 중 오류 발생:", error.message);
        setError(error.message);
      }
    }
  };

  const removeFromCart = async (product_id) => {
    try {
      const response = await axiosInstance.delete(
        `customFit/cart/delete_item/${product_id}/`,
        {
          headers: {
            "X-CSRFToken": localStorage.getItem("csrftoken") || "",
          },
        }
      );
      console.log("API 응답:", response.data);
      console.log(`상품 ID ${product_id}이(가) 카트에서 제거되었습니다.`);
      await checkCartStatus(); // 카트 상태 체크
    } catch (error) {
      console.error("카트에서 제거 중 오류 발생:", error.message);
      setError(error);
    }
  };

  const addToBox2Items = async () => {
    if (selectedItems.length === 0) {
      console.log("선택된 상품이 없습니다.");
      return;
    }

    const newItems = selectedItems.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
    }));

    const uniqueItems = newItems.filter(
      (newItem) =>
        !box2Items.some((boxItem) => boxItem.product_id === newItem.product_id)
    );

    try {
      for (const item of uniqueItems) {
        await addToCart(item.product_id);
      }
      setBox2Items((prevItems) => [...prevItems, ...uniqueItems]);
      console.log("Box2에 추가된 상품:", uniqueItems);
      await checkCartStatus(); // 카트 상태 체크
    } catch (error) {
      console.error("상품 추가 중 오류 발생:", error.message);
      setError(error);
    } finally {
      setSelectedItems([]);
    }
  };

  const deleteItemFromBox2 = async (id) => {
    try {
      await removeFromCart(id);
      setBox2Items((prevItems) =>
        prevItems.filter((item) => item.product_id !== id)
      );
      await checkCartStatus(); // 카트 상태 체크
    } catch (error) {
      console.error("Box2 항목 삭제 중 오류 발생:", error.message);
      setError(error);
    }
  };

  // 카트를 모두 비우는 함수
  const clearBox2Items = async () => {
    try {
      await axiosInstance.post(
        "customFit/cart/clear/",
        {},
        {
          headers: {
            "X-CSRFToken": localStorage.getItem("csrftoken") || "",
          },
        }
      );
      setBox2Items([]);
      console.log("Box2의 모든 상품이 카트에서 제거되었습니다.");
      await checkCartStatus(); // 카트 상태 체크
    } catch (error) {
      console.error("Box2 항목 삭제 중 오류 발생:", error.message);
      setError(error);
    }
  };

  // 선택된 상품 카트에서 제거
  const deleteSelectedItem = async (id) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((item) => item.product_id !== id)
    );

    try {
      await removeFromCart(id);
      console.log(`상품 ID ${id}이(가) 카트에서 삭제되었습니다.`);
      await checkCartStatus(); // 카트 상태 체크
    } catch (error) {
      console.error("선택된 항목 삭제 중 오류 발생:", error.message);
      setError(error);
    }
  };

  // 선택된 모든 상품을 카트에서 제거하는 함수
  const clearSelectedItems = async () => {
    try {
      for (const item of selectedItems) {
        await removeFromCart(item.product_id);
      }
      setSelectedItems([]);
      console.log("선택된 모든 상품이 카트에서 제거되었습니다.");
      await checkCartStatus(); // 카트 상태 체크
    } catch (error) {
      console.error("선택된 항목 모두 삭제 중 오류 발생:", error.message);
      setError(error);
    }
  };

  const handleCompare = async () => {
    setLoading(true);
    setCartError(null);
    try {
      const cartResponse = await axiosInstance.get("customFit/cart/");
      if (cartResponse.data.length === 0) {
        setCartError("상품을 추가한 후 비교해 주세요.");
        return;
      }

      const response = await axiosInstance.get("customFit/compare/");
      const recommendedProduct = response.data.recommended_product;

      navigate("/main3", { state: { recommendedProduct } });

      await clearBox2Items();
      console.log("비교 후 카트가 비워졌습니다.");
      await checkCartStatus(); // 카트 상태 체크
    } catch (error) {
      console.error("비교하기 중 오류 발생:", error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // 로컬 저장소에서 사용자 정보를 제거합니다.
    localStorage.removeItem("user");

    // 세션 저장소에서 사용자 정보를 제거합니다.
    sessionStorage.removeItem("user");

    // 쿠키 제거 (필요한 경우)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .trim()
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    console.log("로그아웃 성공");

    // 로그인 페이지로 리디렉션합니다.
    navigate("/Login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (userError) {
    // 사용자 정보 에러가 있는 경우
    return <div>Error: {userError}</div>;
  }

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <l.Container>
      <l.Header>
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
        <l.Border>
          <div></div>
        </l.Border>
      </l.Header>

      {isMenuOpen && (
        <>
          <l.Backdrop onClick={closeMenu} />
          <l.DropdownMenu>
            <l.DropdownItem onClick={goMypage}>
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
            </l.DropdownItem>
            <l.DropdownItem onClick={goMyreview}>
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
            </l.DropdownItem>
            <l.DropdownItem onClick={goMain0}>
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
            </l.DropdownItem>
            <l.DropdownItem
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
            >
              <img
                id="logout"
                src="/static/logo/logout.svg"
                alt="logout"
                style={{
                  position: "absolute",
                  right: "8px",
                  cursor: "pointer",
                }}
              />
            </l.DropdownItem>
          </l.DropdownMenu>
        </>
      )}

      <l.Top>
        {userInfo.first_name}님에게 맞는 <br />
        식품을 찾아볼까요?
      </l.Top>

      <l.Keyword>
        <l.SmallBox>#{getDiseaseName(userInfo.disease)}</l.SmallBox>
      </l.Keyword>

      <l.InputBlank>
        <img id="ylogo" src="/static/logo/ylogo.svg" alt="로고" width="30px" />
        <input
          type="text"
          placeholder="검색어를 입력하세요."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <img
          id="search"
          src="/static/logo/search.svg"
          alt="검색 버튼"
          onClick={handleSearch}
        />
      </l.InputBlank>

      <l.List>
        <l.Keywordd>
          <l.ProductName>상품명</l.ProductName>
          <l.SmallBox2>제조사</l.SmallBox2>
          <l.SmallBox0>용량</l.SmallBox0>
          <l.SmallBox0>선택하기</l.SmallBox0>
        </l.Keywordd>

        <l.List2>
          {list2Items.map((item) => (
            <l.Keywordd key={item.product_id}>
              <l.ProductName2>{item.product_name}</l.ProductName2>
              <l.SmallBox3>{item.manufacturer}</l.SmallBox3>
              <l.SmallBox6>{item.Capacity}g</l.SmallBox6>
              <l.SmallBox4>
                <l.Checkborder>
                  <l.Check
                    isChecked={selectedItems.some(
                      (selectedItem) =>
                        selectedItem.product_id === item.product_id
                    )}
                    onClick={() => toggleCheckbox(item)}
                  >
                    {selectedItems.some(
                      (selectedItem) =>
                        selectedItem.product_id === item.product_id
                    ) && "\u2714"}
                  </l.Check>
                </l.Checkborder>
              </l.SmallBox4>
            </l.Keywordd>
          ))}
        </l.List2>
      </l.List>

      <l.Kit>맞춤 건강 카트</l.Kit>

      <l.Body>
        <l.SelectedItemsSection>
          <l.SelectedItemsList>
            {selectedItems.map((item) => (
              <l.SelectedItem key={item.product_id}>
                {/* 상품 이름의 앞 5글자만 표시 */}
                {item.product_name.length > 5
                  ? item.product_name.substring(0, 5) + ".."
                  : item.product_name}
                <l.DelButton>
                  <img
                    id="del"
                    src="/static/logo/delbtn.svg"
                    alt="삭제 버튼"
                    width="20px"
                    height="20px"
                    onClick={() => deleteSelectedItem(item.product_id)}
                  />
                </l.DelButton>
              </l.SelectedItem>
            ))}
          </l.SelectedItemsList>
          <l.Icon>
            <img
              id="trash"
              src="/static/logo/trash.svg"
              alt="휴지통"
              width="21px"
              height="22"
              onClick={clearSelectedItems}
            />
          </l.Icon>
        </l.SelectedItemsSection>
        <l.Button onClick={handleCompare}>
          <l.ButtonText>비교하기</l.ButtonText>
        </l.Button>
        {cartError && (
          <div style={{ color: "red", marginTop: "10px" }}>{cartError}</div>
        )}
      </l.Body>
    </l.Container>
  );
};

export default Main2;
