import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/Routes/PrivateRoute";
import Footer from "./components/Footer/Footer";
import Home from "./views/Home/Home";
import SignUp from "./views/Auth/SignUp";
import SignIn from "./views/Auth/SignIn";
import WritingGroups from "./views/Writing/WritingGroups";
import WritingWords from "./views/Writing/WritingWords/WritingWords";
import Groups from "./views/Groups/Groups";
import Group from "./views/Groups/Group/Group";

import './App.css';

function App() {
	return (
		<>
			<BrowserRouter basename={process.env.MIX_REACT_APP_BASE_URL}>
				<Routes>
					<Route path="/" element={<PrivateRoute />}>
						<Route index element={<Home />} />

						<Route path="writing">
							<Route index element={<WritingGroups />} />
							<Route path=":groupId" element={<WritingWords />} />
						</Route>

						<Route path="groups">
							<Route index element={<Groups />} />
							<Route path=":groupId" element={<Group />} />
						</Route>
					</Route>

					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />
				</Routes>
				<Footer />
			</BrowserRouter>
		</>
	);
}

export default App;
