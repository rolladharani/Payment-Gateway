// // // import { useState } from "react";

// // // export default function Login({ onLogin }) {
// // //   const [key, setKey] = useState("");
// // //   const [secret, setSecret] = useState("");

// // //   const submit = () => {
// // //     localStorage.setItem("apiKey", key);
// // //     localStorage.setItem("apiSecret", secret);
// // //     onLogin();
// // //   };

// // //   return (
// // //     <div data-test-id="login-page">
// // //       <h2>Merchant Login</h2>

// // //       <input
// // //         data-test-id="input-api-key"
// // //         placeholder="API Key"
// // //         value={key}
// // //         onChange={(e) => setKey(e.target.value)}
// // //       />

// // //       <input
// // //         data-test-id="input-api-secret"
// // //         placeholder="API Secret"
// // //         value={secret}
// // //         onChange={(e) => setSecret(e.target.value)}
// // //       />

// // //       <button data-test-id="login-button" onClick={submit}>
// // //         Login
// // //       </button>
// // //     </div>
// // //   );
// // // }
// // import { useState } from "react";
// // import { setAuthHeaders } from "../api/client";

// // export default function Login({ onLogin }) {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");

// //   const submit = (e) => {
// //     e.preventDefault();

// //     // Use test merchant credentials internally
// //     setAuthHeaders("key_test_abc123", "secret_test_xyz789");

// //     onLogin();
// //   };

// //   return (
// //     <form data-test-id="login-form" onSubmit={submit}>
// //       <h2>Merchant Login</h2>

// //       <input
// //         data-test-id="email-input"
// //         type="email"
// //         placeholder="Email"
// //         value={email}
// //         onChange={(e) => setEmail(e.target.value)}
// //       />

// //       <input
// //         data-test-id="password-input"
// //         type="password"
// //         placeholder="Password"
// //         value={password}
// //         onChange={(e) => setPassword(e.target.value)}
// //       />

// //       <button data-test-id="login-button" type="submit">
// //         Login
// //       </button>
// //     </form>
// //   );
// // }
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const submit = (e) => {
//     e.preventDefault();

//     // dummy login (allowed by instructions)
//     if (email === "test@example.com") {
//       navigate("/dashboard");
//     } else {
//       alert("Invalid credentials");
//     }
//   };

//   return (
//     <form data-test-id="login-form" onSubmit={submit}>
//       <h2>Login</h2>

//       <input
//         type="email"
//         placeholder="Email"
//         data-test-id="email-input"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         data-test-id="password-input"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button data-test-id="login-button">Login</button>
//     </form>
//   );
// }
import { useNavigate } from "react-router-dom";
import { setAuthHeaders } from "../api/client";

export default function Login() {
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();

    const apiKey = "key_test_abc123";
    const apiSecret = "secret_test_xyz789";

    // save credentials
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("apiSecret", apiSecret);

    setAuthHeaders(apiKey, apiSecret);

    navigate("/dashboard");
  };

  return (
    <form data-test-id="login-form" onSubmit={submit}>
      <h2>Merchant Login</h2>

      <input
        type="email"
        data-test-id="email-input"
        defaultValue="test@example.com"
      />

      <input
        type="password"
        data-test-id="password-input"
        defaultValue="password"
      />

      <button data-test-id="login-button">Login</button>
    </form>
  );
}
