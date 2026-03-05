"use client";
import { UserProperties } from "@/types/user.type";

interface PropTypes {
  address: UserProperties["address"];
}

const Address = ({ address }: PropTypes) => {
  return <div>{address}</div>;
};

export default Address;
