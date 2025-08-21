import LoginForm from "./Login_form";

const Login = () => {
  const handleLogin = async (credentials, setErrors) => {
    try {
      const ws = new WebSocket("ws://localhost:8000/auth/login");
      // 🔹 Change to your backend URL (http/https → ws/wss)

      ws.onopen = () => {
        console.log("WebSocket connected, sending credentials...");
        ws.send(JSON.stringify(credentials));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.error) {
          console.error("Login error:", data.error);
          setErrors({
            username: "",
            password: "",
            general: data.error,
          });
          ws.close();
          return;
        }

        if (data.access_token) {
          console.log("Login successful:", data);
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("username", credentials.username);
          ws.close();
          window.location.href = "/home";
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setErrors({
          username: "",
          password: "",
          general: "Login failed. Try again later.",
        });
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
      };
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrors({
        username: "",
        password: "",
        general: "Login failed. Try again later.",
      });
    }
  };

  return <LoginForm handleLogin={handleLogin} />;
};

export default Login;
