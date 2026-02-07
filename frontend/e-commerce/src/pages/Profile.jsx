import { useAuth } from "../context/authContext";
import { FiUser, FiMail, FiShield, FiCalendar } from "react-icons/fi";
import Loader from "../components/ui/Loader";

const Profile = () => {
	const { user } = useAuth();

	if (!user) {
		return <Loader />;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-2xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

				<div className="bg-white rounded-xl shadow-sm overflow-hidden">
					<div className="bg-slate-800 px-6 py-8 text-center">
						{user.avatar ? (
							<img
								src={user.avatar}
								alt={user.name}
								className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white"
							/>
						) : (
							<div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center mb-4">
								<span className="text-3xl font-bold text-slate-800">
									{user.name?.charAt(0).toUpperCase()}
								</span>
							</div>
						)}
						<h2 className="text-xl font-semibold text-white">{user.name}</h2>
						<p className="text-slate-300 text-sm mt-1">{user.email}</p>
					</div>

					<div className="p-6 space-y-4">
						<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
							<div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
								<FiUser className="text-slate-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Full Name</p>
								<p className="font-medium text-gray-900">{user.name}</p>
							</div>
						</div>

						<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
							<div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
								<FiMail className="text-slate-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Email Address</p>
								<p className="font-medium text-gray-900">{user.email}</p>
							</div>
						</div>

						<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
							<div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
								<FiShield className="text-slate-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Account Type</p>
								<p className="font-medium text-gray-900 capitalize">{user.role}</p>
							</div>
						</div>

						{user.createdAt && (
							<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
								<div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
									<FiCalendar className="text-slate-600" />
								</div>
								<div>
									<p className="text-sm text-gray-500">Member Since</p>
									<p className="font-medium text-gray-900">
										{new Date(user.createdAt).toLocaleDateString("en-IN", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
