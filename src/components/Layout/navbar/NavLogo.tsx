import img from '../../../assets/icon-logo.png'


export default function NavLogo() {
  return (
    <a href="/" className="flex items-center gap-2 group cursor-pointer select-none">
      <img src={img} alt="Academix" className='w-10 h-10'/>
      <span className="font-display text-h2 font-extrabold text-primary tracking-tight">
        Academix
      </span>
    </a>
  );
}
