import LoginForm from "../components/auth/LoginForm";
import illustration from "../assets/illustration.png";


export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-100 via-blue-100 to-blue-200 items-center justify-center p-12">
  <div className="bg-[#f5f0e8] rounded-2xl w-full max-w-[480px] aspect-square flex items-center justify-center shadow-sm overflow-hidden">
    <img 
      src={illustration} 
      alt="AI Education Illustration"
      className="w-full h-full object-cover"
    />
  </div>
</div>

      
      <div className="flex flex-1 items-center justify-center px-8 py-12 bg-white">
        <LoginForm />
      </div>
    </div>
  );
}