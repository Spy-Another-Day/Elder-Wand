import {useState} from 'react';

const ClueInput = ({ submitClue }) => {
  const [clueInput, setClueInput] = useState('');
  const [clueNumberInput, setClueNumberInput] = useState('');
  const [alertMessage, setAlertMessage] = useState({show: false, text: ''});
  const [editing, setEditing] = useState(true);

  const shareHandler = () => {
    if (clueInput === '') {
      setAlertMessage({show: true, text: 'Enter a clue for your team before sharing.'})
    } else if (!(clueNumberInput === 'unlimited' || (Number.parseInt(clueNumberInput) >= 0 && Number.parseInt(clueNumberInput) <= 9))) {
      setAlertMessage({show: true, text: 'Enter a valid number of cards (0 - 9, or unlimited) before sharing.'})
    } else {
      submitClue(clueInput, clueNumberInput);
      setEditing(false);
    }
  }

  

  return (
    <div className='clue-container mt-9'>
      <input
        type='text'
        value={clueInput}
        onChange={(e) => setClueInput(e.target.value)}
        placeholder='Enter your clue'
        className='input input-bordered w-80 max-w-xs'
      />
      <input
        type='text'
        value={clueNumberInput}
        onChange={(e) => setClueNumberInput(e.target.value)}
        placeholder='# of cards?'
        className='input input-bordered w-40 max-w-xs'
      />
      {editing && <input type='button' value='Share' onClick={editing ? shareHandler : () => {}} className='btn'/>}
      {alertMessage.show &&
      <div className="badge badge-error gap-2 m-auto">
        <svg className="w-4 h-4 stroke-current hover:border"
          onClick={() => setAlertMessage({show: false, text: ''})}
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12">
          </path>
        </svg>
        {alertMessage.text}
      </div>
      }
    </div>
  );
}

export default ClueInput;