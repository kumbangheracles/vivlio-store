import React from "react";
import Layout from "../../components/Layout";
import Banner from "./components/Banner";
import ListBook from "./components/ListBook";
export default function Home() {
  return (
    <>
      <Layout>
        <div>
          <Banner />
        </div>
        <ListBook />
      </Layout>
    </>
  );
}
