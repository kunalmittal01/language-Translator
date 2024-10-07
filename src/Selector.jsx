import Languages from "./languages";

const Selector = (props)=> {

 return (
    <div className="select relative">
        <select value={props.value}
        className="absolute rounded-lg  w-full py-3 px-2 text-white text-xl font-medium" name="source" id="source"
        onChange={props.onChange}
        >
            {
                Languages.map(lang=>{
                    return <option key={Date.now() + Math.random()*1000 + ""} value={lang.code}>{lang.name}</option>
                })
            }
        </select>
    </div>
 )
}

export default Selector;