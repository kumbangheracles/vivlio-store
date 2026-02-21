import fetchUser from "@/app/actions/fetchUser";
import AccountMobileIndex from "@/components/Account/mobile/AccountMobile";
import fetchCategory from "@/app/actions/fetchCategory";
const AccountMobilePage = async () => {
  const dataUser = await fetchUser();
  const dataCategory = await fetchCategory();
  return <AccountMobileIndex dataCategory={dataCategory} dataUser={dataUser} />;
};

export default AccountMobilePage;
