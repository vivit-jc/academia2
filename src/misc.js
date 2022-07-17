export function get_crystal_num(result){
  return result.filter(e=> e.length==2).length
}

export function ele_j(e) {
  return e[0]+"-"+e[1]
}

export function obj_img(obj) {
  let t = obj.otype
  if(t === "duplicate"){t = "reagent"}
  else if(obj==="reagent"){t = obj}
  else if(obj.src){t = obj.src}
  else if(!t){t = "white"}
  return require("./assets/img/"+t+".png")
}

export function obj_j(obj) {
  let t = obj.otype
  if(t === "duplicate" || t === "reagent"){return "試薬"}
  else if(obj === "reagent"){return "試薬"}
  else if(t === "potion"){return "ポーション"}
  else if(t === "crystal"){return "結晶"}
  else if(!t){return obj.name} // 素材の場合
  else{return false}
}

export function get_cauldron_mat(c){
  if(c.length != 2) return false;
  let r = []
  c.forEach(e=>{
    if(e.otype === "reagent") r.push(e.materials)
    else r.push(e.name)
  })
  return r.sort();
}

export function search_notes(notes, cauldron){
  return notes.find(n => {
    let c = get_cauldron_mat(cauldron);
    if(!c) return false;
    if(n.theme != "exp") return false;
    return c.join() === n.materials.sort().join();
  })
}

export function get_m_from_name(materials, name){
  if(Array.isArray(name)){
    console.log("gm",JSON.stringify(name))
    return "reagent"
  } else {
    return materials.find(m => m.name === name)
  }
}

export function get_ele_from_name(materials, name){
  return materials.find(e => e.name === name).ele
}

export function calc_potion(cauldron){
  // in [result, result]
  // out result
  let elements = [].concat(cauldron[0],cauldron[1])
  let atoms = ["f","t","e","w","s","d"]
  let pairs = [["f","t"],["e","w"],["s","d"]]
  let result = elements.sort()
    
  // 対消滅
  pairs.forEach(pair => {
    if(elements.includes(pair[0]) && elements.includes(pair[1])){
      result = result.filter(e => {
        return (e != pair[0] && e != pair[1])
      })
    }
  })

  // 結晶化
  atoms.forEach(a => {
    if(result.filter(e => e==a).length == 2){
      result = result.filter(e => e!=a)
      result.push(a+a)
    }
  })

  //console.log("calc",cauldron,result)
  return result
}

export function show_report(result){
  let mal = result.join().replace(/,/g,"").length
  let crystal = false
  let same = false
  let msg = []
  if(result.length == 1 && get_crystal_num(result) == 1){
    crystal = true;
  } else if(result.filter(e => e.length == 2).length == 2){
    same = true
  }
  msg = [result.join(),`魔力量: ${mal}mal`]
  if(crystal) msg.push("結晶が析出した")
  if(same) msg.push("反応は起きなかった")

  return msg;
}

export function get_object_type(result){
  let crystal = get_crystal_num(result)
  if(crystal == 2){
    return "duplicate"
  } else if(crystal == 1 && result.length == 3){
    return "potion"
  } else if(crystal == 1){
    return "crystal"
  } else if(result.length == 2){
    return "reagent"
  } else {
    return false
  }
}

export function get_reagent_number(notes, mat){
  if(!Array.isArray(mat)){return false}
  return notes.find(n => JSON.stringify(n.materials) == JSON.stringify(mat)).number
}

export function calc_candidate(type, element){
  if(type === "crystal"){
    return [[element[0],converse(element[1])],[converse(element[0]),element[1]]]
  }
}

export function converse(element){
  if(element === "f"){return "t"}
  else if(element === "t"){return "f"}
  else if(element === "e"){return "w"}
  else if(element === "w"){return "e"}
  else if(element === "d"){return "s"}
  else if(element === "s"){return "d"}
}

export function atom_str(m){
  if(m === "f"){return "fire"}
  else if(m === "t"){return "water"}
  else if(m === "e"){return "earth"}
  else if(m === "w"){return "wind"}
  else if(m === "s"){return "shine"}
  else if(m === "d"){return "dark"}
}
