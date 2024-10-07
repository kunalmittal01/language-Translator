import { useState , useRef ,useEffect} from 'react'
import Selector from './Selector'
import {Snackbar,Alert,LinearProgress,Box} from '@mui/material'
import axios from 'axios'
import Typed from 'typed.js'
import './App.css';

function App() {
  const [sourceText, setSourceText] = useState("")
  const [targetText, setTargetText] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [targetCode, setTargetCode] = useState("");
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(100);
  const [alertMessage, setAlertMessage] = useState("");
  const sourceRef = useRef(null);
  const targetRef = useRef(null);
  const API_KEY = "4c22b22ea5mshad8042ea161777ap1f82dcjsn3ca6fadbaa2d";
  const typeRef = useRef(null);
  const handleClose = (event, reason) => {
    // If the user clicks away or presses escape, close the alert
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };


  useEffect(() => {
    let timer;
    if (open) {
      // When the Snackbar is open, start decreasing the progress
      timer = setInterval(() => {
        setProgress((prev) => (prev > 0 ? prev - 1 : setOpen(false)));
      }, 100);
    }

    return () => clearInterval(timer); // Clear the timer on component unmount or when Snackbar is closed
  }, [open]);

  useEffect(()=>{
      const typed = new Typed(typeRef.current,{
      strings: ['Made with ❤️ by Kunal Mittal'],
      typeSpeed: 70,
      backSpeed: 30,
      loop: true,
      showCursor: true,
    })
    return () => {
      typed.destroy();
    };
  },[]);

  const translateText = async () => {
    const headers = {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'text-translator2.p.rapidapi.com',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    const data = {
      'source_language': sourceCode,
      'target_language': targetCode,
      'text': sourceText  
    }  
    try {
      const response = await axios.post('https://text-translator2.p.rapidapi.com/translate',data,{headers});

      console.log(response);
      
      setTargetText(response.data.data.translatedText);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  const validateFields = ()=>{
    if(sourceCode == '' || targetCode == '') {
      setAlertMessage('choose source and target languages.');
      setOpen(true);
      setProgress(100)
      return -1;
    }
    if(sourceText == '') {
      setAlertMessage('Translate the text first.');
      setOpen(true);
      setProgress(100)
      return -1;
    }
  }
  const copyText = (txtarea)=>{
    const res = validateFields();
    if(res == -1) return;
    if(txtarea == 'source') {
      navigator.clipboard.writeText(sourceText).then(
        setAlertMessage('copied to clipboard'),
        setProgress(20),
        setOpen(true),
        sourceRef.current.focus(),
        sourceRef.current.setSelectionRange(0,sourceText.length)
      ).catch((err)=>{
        console.log(err);
      });  
    }

    else {
      navigator.clipboard.writeText(targetText).then(
        setAlertMessage('copied to clipboard'),
        setOpen(true),
        setProgress(100),
        targetRef.current.focus(),
        targetRef.current.setSelectionRange(0,targetText.length)
      ).catch((err)=>{
        console.log(err);
      });
    }
  }

  const clearText = ()=>{
      setSourceText("");
      setSourceCode("");
      sourceRef.current.focus();
      sourceRef.current.setSelectionRange(0,0);
    
  }

  const handleTranslate = ()=>{
    const res = validateFields();
    if(res == -1) {return};
    setAlertMessage('translation in progress!')
    setOpen(true);
    setProgress(100);
    translateText();   
  }

  return (
    <>
      <nav className="text-center py-4">
        <p className="text-white text-3xl font-semibold">Language Translator</p>
      </nav>
      <div className="container mt-16 flex flex-col items-center gap-20 md:flex-row md:gap-0 justify-around">
        <div className="left w-11/12 md:w-1/3 flex flex-col gap-24">
          <Selector value={sourceCode} onChange={(e)=> setSourceCode(e.target.value)} />
          <div className="input-txtarea">
            <textarea ref={sourceRef} className="text-white opacity-85 w-full h-56 p-2  text-lg rounded-xl"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text here..."
            />
            <div className="copy flex justify-end gap-5 mt-4 mr-4">
              <svg onClick={()=>copyText('source')} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM382 896h-.2L232 746.2v-.2h150v150z"></path></svg>
              <svg onClick={()=>clearText()} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
            </div>
          </div>
        </div>
        <div className="right w-11/12 md:w-1/3 flex flex-col gap-24">
          <Selector value={targetCode} onChange={(e)=> setTargetCode(e.target.value)} />
          <div className="output-txtarea">
            <textarea ref={targetRef} className="text-white opacity-85 w-full h-56 p-2  text-lg rounded-xl"
              value={targetText}
              onChange={(e) => setSourceText(e.target.value)}
              disabled
            />
            <div className="copy flex justify-end gap-5 mt-4 mr-4">
              <svg onClick={()=>copyText('target')} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM382 896h-.2L232 746.2v-.2h150v150z"></path></svg>
            </div>
          </div>
        </div>
      </div>
      <div className="translate-btn mt-7 flex justify-center text-xl text-white font-semibold">
        <button onClick={handleTranslate}>Translate</button>
      </div>
      <div ref={typeRef} className="footer text-center text-white mt-16"></div>
      <ul className="boxArea">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <Snackbar
        open={open}
        autoHideDuration={10000} // Set duration to 10 seconds (10000ms)
        onClose={()=>handleClose('clickaway')} // Handle when user clicks away or presses escape
      >
        <Alert
          onClose={() => setOpen(false)} // Handle close when the 'x' icon or any interaction occurs
          severity="success" // Set alert severity to success
          sx={{ width: '100%',backgroundColor: "#A7233A" , color: 'white' }} // Full width styling
        >
          {alertMessage}
          <Box sx={{ width: '100%', mt: 1 ,backgroundColor: 'green'}}>
            <LinearProgress variant="determinate" value={progress}  sx={{backgroundColor: '#e0e0e0','& .MuiLinearProgress-bar': {
                  backgroundColor: '#ff5722'}}}/>
          </Box>
        </Alert>
      </Snackbar>
    </>
  )
}

export default App
