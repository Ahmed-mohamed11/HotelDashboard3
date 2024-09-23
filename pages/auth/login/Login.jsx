import { useEffect, useState } from "react";
import FormLogin from "./form/FormLogin";
import api from "../../../ApiUrl";  
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import LogoWide from "../../../images/logo.png";
import BGStart from "../../../images/bg-start.jpg";
import { ErrorAlert } from "../../../components/Alert";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleEmailInput = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    props.loading(true);

    const requestData = {
      email: email,
      password: password,
    };

    try {
      const response = await api.post("/hotel/hotel-login/", requestData); // تأكد من صحة الـ endpoint
      console.log(response);
      props.loading(false);

      const data = response.data;
      const token = data.token;
      const id = data.id;
      const role = data.role;  

      localStorage.setItem("token", token);  
      localStorage.setItem("id", id);

      const secretKey = "s3cr3t$Key@123!";
      const encryptedRole = CryptoJS.AES.encrypt(role, secretKey).toString();
      sessionStorage.setItem("role", encryptedRole);

      props.onLogIn();
      navigate("/");  
    } catch (error) {
      setErrorMsg("حدث خطأ أثناء تسجيل الدخول. تأكد من صحة البيانات.");
      props.loading(false);
    }
  };

  useEffect(() => {
    const isTokenValid = localStorage.getItem("token");
    if (isTokenValid) {
      navigate(`${import.meta.env.VITE_PUBLIC_URL}/`);
    }
  }, [navigate]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center
      lg:justify-between w-full mx-auto gap-x-10`}
    >
      {errorMsg && (
        <ErrorAlert
          title={"خطأ"}
          text={errorMsg}
          closeClick={() => setErrorMsg(null)} // تأكد من إعادة تعيين رسالة الخطأ بشكل صحيح
        />
      )}
      <div
        className="bg-gray-900 border-2 rounded-xl lg:border-none
        shadow-md w-96 md:w-1/2 xl:w-1/3 lg:shadow-none"
        dir="rtl"
      >
        <div className="flex flex-col gap-2 p-3 justify-center items-center w-full text-white">
          <h1 className="font-medium text-base ">{errorMsg}</h1>
          <h1 className="font-semibold text-2xl">سجل دخول</h1>
          <p className="text-center font-medium text-base">
            الوصول إلى لوحة معلومات باستخدام بريدك الإلكتروني او اسم المستخدم
            وكلمة المرور
          </p>
        </div>
        <FormLogin
          buttonText="تسجيل الدخول"
          handlePasswordChange={handlePasswordChange}
          handleEmailInput={handleEmailInput}
          handleSubmitLogin={handleLogin}
        />
      </div>
      <div
        className="w-2/3 md:w-1/2 xl:w-2/3 min-h-screen hidden lg:block"
        style={{
          backgroundImage: `url(${BGStart})`,
          backgroundSize: "cover",
          borderRadius: "lg",
        }}
      >
        <div className="flex items-center w-full min-h-screen bg-black bg-opacity-50">
          <img src={LogoWide} alt="" className="mx-auto my-auto" />
        </div>
      </div>
    </div>
  );
}
