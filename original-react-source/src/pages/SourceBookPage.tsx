import { ExternalLink } from 'lucide-react';
import { useApp } from '../components/AppContext';

export function SourceBookPage() {
  const { state } = useApp();
  const l = state.language;
  const sourceUrl = `${import.meta.env.BASE_URL}source/hajj-umrah-masail-gujarati.pdf`;

  return (
    <div className="page source-page">
      <div className="page-heading">
        <span className="eyebrow">{l === 'en' ? 'PRIMARY SOURCE' : 'મુખ્ય સ્ત્રોત'}</span>
        <h1>{l === 'en' ? 'Original Gujarati Hajj and Umrah guide' : 'મૂળ ગુજરાતી હજ અને ઉમરા માર્ગદર્શિકા'}</h1>
        <p>
          {l === 'en'
            ? 'This embedded PDF remains the authority for the project’s topic coverage. Use the bilingual app layer for learning and the scan for source comparison.'
            : 'આ એમ્બેડ કરેલ PDF પ્રોજેક્ટના વિષય આવરણ માટે અધિકૃત સ્ત્રોત રહે છે. શીખવા માટે દ્વિભાષી એપ સ્તર અને સ્ત્રોત સરખામણી માટે સ્કેનનો ઉપયોગ કરો.'}
        </p>
        <a className="primary-button" href={sourceUrl} target="_blank" rel="noreferrer">
          {l === 'en' ? 'Open full screen' : 'પૂર્ણ સ્ક્રીનમાં ખોલો'}
          <ExternalLink />
        </a>
      </div>
      <div className="pdf-frame">
        <iframe
          title="Original Hajj and Umrah Gujarati guide"
          src={`${sourceUrl}#page=4&view=FitH`}
        />
      </div>
    </div>
  );
}
