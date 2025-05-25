import React from "react";
import Layout from "../../components/Layout";
import Banner from "./components/Banner";
export default function Home() {
  return (
    <>
      <Layout>
        <div>
          <Banner />
        </div>
        <div className="banner">WELCOME TO VIVLIO STORE</div>
        <div className="dictionary">
          <span>INTERNATONAL BOOK</span>
          <span>E-BOOK</span>
          <span>NEW BOOK</span>
        </div>
      </Layout>
    </>
  );
}
