import AccountMobilePage from "@/components/Account/mobile/Index";
import fetchUser from "../actions/fetchUser";

const AccountMobile = async () => {
  const dataUser = await fetchUser();

  return <AccountMobilePage dataUser={dataUser} />;
};

export default AccountMobile;
