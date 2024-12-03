import React, { useEffect, useState, useRef } from "react";
import TodoBoard from "../components/TodoBoard";
import api from "../utils/api";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // 날짜 클릭 시 처리
import { useNavigate } from "react-router-dom"; // useNavigate 추가

import Weather from "./Weather";

const TodoPage = () => {
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0] // 기본값: 오늘 날짜
  );
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [todosByDate, setTodosByDate] = useState({}); // 날짜별 할 일 저장
  const calendarRef = useRef(null); // FullCalendar의 ref
  const navigate = useNavigate(); // navigate 훅 추가
  
  

  // 로그인 상태 확인
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      navigate('/login'); // 토큰이 없으면 로그인 페이지로 리디렉션
    } else {
      api.defaults.headers['Authorization'] = `Bearer ${token}`; // API 요청에 토큰 추가
    }
  }, [navigate]);

 


  // 날짜별 투두 리스트 로드
  const getTasksByDate = async (date) => {
    setLoading(true);
    try {
      const response = await api.get(`/tasks?date=${date}`);
      console.log("Response data for date:", response.data);
      const filteredTasks = response.data.data.filter(
        (task) => task.date === date // 정확히 매칭되는 데이터만 필터링
      );
      setTodoList(filteredTasks);
      setTodosByDate((prev) => ({
        ...prev,
        [date]: filteredTasks.length > 0, // 해당 날짜에 투두가 있으면 true
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // 전체 할 일 가져오기 (최초 로딩 시)
  const getTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get("/tasks");
      if (selectedDate) {
        setTodoList(response.data.data.filter(task => task.date.startsWith(selectedDate))); // selectedDate에 해당하는 데이터만 필터링
      } else {
        setTodoList(response.data.data); // 날짜가 선택되지 않으면 전체 투두리스트 표시
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // 날짜 선택 시 호출되는 함수
  const handleDateClick = (info) => {
    const clickedDate = info.dateStr; // 클릭한 날짜 (yyyy-mm-dd 형식)
    setSelectedDate(clickedDate); // selectedDate 업데이트
    getTasksByDate(clickedDate); // 선택된 날짜에 해당하는 투두리스트 가져오기
  };

  // selectedDate가 변경되었을 때 API 호출
  useEffect(() => {
    getTasks(); // selectedDate가 변경될 때마다 해당 날짜의 투두리스트를 불러옴
  }, [selectedDate]);

  // 투두리스트 항목 추가
  const addTodo = async () => {
    if (!selectedDate) {
      alert("날짜를 선택하세요.");
      return;
    }

    try {
      console.log('selectedDate')
      const response = await api.post("/tasks", {
        task: todoValue,
        isComplete: false,
        date: selectedDate, // 선택한 날짜 전달
      });
      if (response.status === 200) {
        setTodoList((prev) => [
          ...prev,
          {
            _id: response.data.data._id, // 서버에서 반환된 ID
            task: todoValue,
            isComplete: false,
            date: selectedDate,
          },
        ]);
      }
      setTodoValue(""); // 입력값 초기화
    } catch (error) {
      console.log("Error adding task:", error.response?.data || error);
    }
  };

  // 투두리스트 항목 삭제
  const deleteItem = async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      if (response.status === 200) {
        setTodoList((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  // 투두리스트 항목 완료 상태 변경
  const toggleComplete = async (id) => {
    try {
      const task = todoList.find((item) => item._id === id);
      const response = await api.put(`/tasks/${id}`, {
        isComplete: !task.isComplete,
      });
      if (response.status === 200) {
        setTodoList((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, isComplete: !item.isComplete } : item
          )
        );
      }
    } catch (error) {
      console.log("Error toggling task completion:", error.response?.data || error);
    }
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    sessionStorage.removeItem("token"); // 세션 저장소에서 토큰 삭제
    delete api.defaults.headers["authorization"]; // API 요청 헤더에서 토큰 제거
    navigate("/login"); // 로그인 페이지로 리다이렉트
  };



  return (
    <Container>
      <div className="todopage-titleBox">
        <div className="todopage-title"> TODOLIST </div>
        
        <button onClick={handleLogout} className="button-primary">로그아웃</button>
      </div>
      <div> <Weather/></div>
      <Row>
        <Col className="calendar-box" md={4}>
          <div>
          <FullCalendar
  ref={calendarRef}
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  dateClick={handleDateClick} // 날짜 클릭 이벤트
  dayCellClassNames={(arg) => {
    const localDate = new Date(arg.date).toLocaleDateString("en-CA"); // yyyy-mm-dd 형식
    const classes = [];
    if (todosByDate[localDate]) classes.push("has-todo"); // 해당 날짜에 투두가 있으면 "has-todo"
    if (localDate === selectedDate) classes.push("selected-date"); // 선택된 날짜에 "selected-date"
    return classes;
  }}
/>
            {loading && <div>로딩 중...</div>}
          </div>
        </Col>
        <Col md={8}>
          <Row className="add-item-row">
            <Col xs={12} sm={10}>
              <input
                type="text"
                placeholder="할일을 입력하세요"
                onChange={(event) => setTodoValue(event.target.value)}
                className="input-box"
                value={todoValue}
              />
            </Col>
            <Col xs={12} sm={2}>
              <button onClick={addTodo} className="button-add">추가</button>
            </Col>
          </Row>
          <h2>{selectedDate ? `${selectedDate}의 할 일` : "전체 할 일"}</h2>
          {loading ? (
            <div>로딩 중...</div>
          ) : (
            <TodoBoard
              todoList={todoList}
              deleteItem={deleteItem}
              toggleComplete={toggleComplete}
            />
          )}
          <div className="nullBox"></div>
          
        </Col>
      </Row>
    </Container>
  );
};

export default TodoPage;
