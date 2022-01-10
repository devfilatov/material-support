import { useStore } from "@umbrellio/observable";

import UsersStore from "../../store/users";
import AdminModule from "./module/Admin";
import ManagerModule from "./module/Manager";
import StudentModule from "./module/Student";

const Home = () => {
  const { current: currentUser } = useStore(UsersStore);

  switch (currentUser.role) {
    case "admin":
      return <AdminModule />;
    case "manager":
      return <ManagerModule />;
    case "student":
      return <StudentModule />;
    default:
      return null;
  }
};

export default Home;
