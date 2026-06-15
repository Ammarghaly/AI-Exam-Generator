import img from '../../../assets/icon-logo.png'


export default function FooterLogo() {
  return (
    <div className="col-span-2 md:col-span-1">
      <div className="flex items-center gap-sm mb-lg">
        <img src={img} alt="Academix" className='w-10 h-10'/>
        <span className="font-display text-h3 font-extrabold text-primary">Academix</span>
      </div>
      <p className="font-body text-small text-on-surface-variant">
        The future of academic assessment is here. Empowering educators with intelligent mentoring
        tools.
      </p>
    </div>
  );
}
