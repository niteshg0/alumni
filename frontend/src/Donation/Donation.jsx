import React, { useState } from "react";
import { useDonationMutation } from "../redux/Api/donationApi";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

const Donation = () => {
  const {user}= useSelector(state=> state.auth)
  // console.log("user", user);

  const PORT= import.meta.env.VITE_BACKEND_PORT

//   const [amount, setAmount] = useState("");
//   const [donationType, setDonationType] = useState("One-Time");
  const [formData, setFormData] = useState({
    rollNumber: user?.data?.rollNumber || "",
    amount: "",
    donationType: "",
    message: "",
  });

  const [donation, {isLoading}]= useDonationMutation()
  
  

  const handleAmountClick = (selectedAmount) => {
    setFormData({...formData, amount: selectedAmount});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!user){
      // alert("please Login")
      toast("Please Login ...", {
        style: {
          background: "#1f2937", // Dark gray
          color: "#f87171", // Light red text
          border: "1px solid #dc2626", // Red border
        },
      })}

    if (!formData.amount) {
        // alert("Please enter a donation amount.");
        toast("Please enter a donation amount", {
          style: {
            background: "#1f2937", // Dark gray
            color: "#f87171", // Light red text
            border: "1px solid #dc2626", // Red border
          },
        })
        return;
      }

    try {
        const donate= await donation(formData);
        // console.log(donate);
        

        if(!donate.data.donation.id){
            // alert("Failed to create Donation Order");
            toast("Failed to create Donation Order", {
              style: {
                background: "#1f2937", // Dark gray
                color: "#f87171", // Light red text
                border: "1px solid #dc2626", // Red border
              },
            })
            return;
        }

        setFormData({
            amount: "",
            donationType: "",
            message: "",
          })
        
          const options = {
            key: import.meta.env.VITE_RAZOR_PAY_API_ID,
            amount: donate.data.donation.amount, 
            currency: "INR",
            name: "Alumni Association",
            description: "Test Transaction",
            image: "/AA-logo.png",
            order_id: donate.data.donation.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            // callback_url: `http://localhost:${PORT}/api/donation/verify`,
            callback_url: `https://alumni-backend-8eqk.onrender.com/api/donation/verify`,
            prefill: {
                "name": user?.data?.fullname || "",
                "email": user.data.email || "",
                "contact": "",
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#1F1DBF"
            }
        };

        const rzp1 = new window.Razorpay(options);
        
        rzp1.open();


        
    } catch (error) {
        // console.error(error?.data?.message || error.message);
        toast("Internal Error", {
          style: {
            background: "#1f2937", // Dark gray
            color: "#f87171", // Light red text
            border: "1px solid #dc2626", // Red border
          },
        })
        console.log(error);
        
    }
    
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-6">
      {/* Header */}
      <div className="text-center my-8">
        <h1 className="text-4xl font-bold text-indigo-400">Support Our Cause</h1>
        <p className="mt-3 text-lg text-gray-300">Your contribution makes a difference.</p>
      </div>

      {/* Donation Box */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        {/* Donation Amount */}
        <h2 className="text-xl font-semibold text-indigo-400">Select Amount</h2>
        <div className="flex gap-3 my-4">
          {[100, 500, 1000, 5000].map((amt) => (
            <button
              key={amt}
              onClick={() => handleAmountClick(amt)}
              className={`px-4 py-2 rounded-lg ${
                formData.amount === amt ? "bg-indigo-500" : "bg-gray-700"
              } hover:bg-indigo-600 transition`}
            >
              ₹{amt}
            </button>
          ))}
        </div>
        <input
          type="number"
          placeholder="Enter Custom Amount"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          className="w-full p-2 rounded-lg bg-gray-700 text-gray-300 focus:outline-none"
        />

        {/* Donation Type */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-indigo-400">Donation Type</h2>
          <div className="flex gap-4 mt-2">
            {["One-Time", "Recurring"].map((type) => (
              <button
                key={type}
                onClick={() => setFormData({...formData, donationType: type})}
                className={`px-4 py-2 rounded-lg ${
                  formData.donationType === type ? "bg-indigo-500" : "bg-gray-700"
                } hover:bg-indigo-600 transition`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* User Details Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          
          <textarea
            name="message"
            placeholder="Message (Optional)"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-700 text-gray-300 focus:outline-none"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 transition py-3 rounded-lg text-white font-semibold mt-4"
            disabled= {isLoading}
          >
            Donate ₹{formData.amount || "Now"}
          </button>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: "linear-gradient(to right, #1f2937, #374151)", // Dark gray gradient
          color: "#e0e7ff", // Light indigo text
          borderRadius: "10px",
          border: "1px solid #4f46e5", // Indigo border
          boxShadow: "0px 4px 10px rgba(79, 70, 229, 0.2)",
        }}
      />
    </div>
  );
};

export default Donation;
