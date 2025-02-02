import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  return <h1 onClick={() => navigate("/detail")}>로그인해야 볼수있는 화면</h1>;
};

export default Home;
