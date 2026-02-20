import fetchUser from "@/app/actions/fetchUser";
import AccountMobileIndex from "@/components/Account/mobile/AccountMobile";

const AccountMobilePage = async () => {
  const dataUser = await fetchUser();

  return <AccountMobileIndex dataUser={dataUser} />;
};

export default AccountMobilePage;
