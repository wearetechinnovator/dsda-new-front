import "../../../assets/css/login.css"
import Logo from '../../../assets/images/b_logo.png';
import { useState } from "react";
import useLoginShake from "../../../hooks/useLoginShake";
import { useNavigate } from 'react-router-dom';
import useMyToaster from "../../../hooks/useMyToaster";
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import Loading from '../../../components/Admin/Loading'



const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', pass: '' });
  const shakeIt = useLoginShake();
  const navigate = useNavigate();
  const toast = useMyToaster();
  const [loading, setLoading] = useState(false);


  const formAction = async (e) => {
    e.preventDefault();
    const fields = Object.fromEntries(new FormData(e.target));

    for (let field of Object.keys(fields)) {
      if (fields[field] === '' || fields[field] === undefined || fields[field] === null) {
        shakeIt('loginBox');
        return;
      }
    }

    try {
      setLoading(true)
      const url = process.env.REACT_APP_MASTER_API + "/admin/login";
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      const res = await req.json();

      setLoading(false);
      if (req.status !== 200 || res.err) {
        return toast(res.err, "error")
      }

      Cookies.set("userId", res.userId);
      Cookies.set("token", res.token, { secure: true });
      navigate("/admin/dashboard")

    } catch (error) {
      setLoading(false)
      console.log(error)
      return toast("Something went wrong", "error")
    }

  }

  return (
    <main className='login__main'>
      <video id="video-background" autoPlay loop muted className="absolute w-full h-full object-cover z-0">
        <source src="/welcome.mp4" type="video/mp4"/>
          Your browser does not support the video tag.
      </video>
      <img src={Logo} alt="Logo.png" className='mb-5 z-10 b__logo' />
      <div className="login__box flex flex-col z-10" id="loginBox">
        <img src={"/swagata2-logo.png"} alt="Logo.png" className='mb-5 z-10 mx-auto' width={"350px"}/>
        <form onSubmit={formAction}>
          <input type="email" name="email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            className='input_style' placeholder='Enter email'
          />
          <input type="password" name="pass"
            value={loginData.pass}
            onChange={(e) => setLoginData({ ...loginData, pass: e.target.value })}
            className='input_style' placeholder='Enter password'
          />
          <button
            disabled={loading ? true : false}
            className='button_style flex items-center gap-2 justify-center'>
            {loading ? <Loading /> : null}
            Sign in
          </button>
        </form>
        <div className='flex justify-center text-[12px]'>
          <Link to={'/admin/forgot-password'}>Forgot password</Link>
        </div>
      </div>
    </main>
  )
}

export default Login;
