export function get_crystal_num(result){
  return result.filter(e=> e.length==2).length
}

export function ele_j(e) {
  return e[0]+"-"+e[1]
}

export function mat_img(m) {
  return require("./assets/img/"+m.src+".png")
}

export function get_cauldron_mat_name(c){
  if(c.length != 2) return false;
  return [c[0].name, c[1].name].sort();
}

export function search_notes(notes, cauldron){
  return notes.filter(n => {
    let c = get_cauldron_mat_name(cauldron);
    if(!c) return false;
    return c.join() === n.materials.sort().join();
  }).length > 0
}

export function get_m_from_name(materials, name){
  return materials.filter(m => m.name === name)[0]
}

export function get_ele_from_name(materials, name){
  return materials.filter(e => e.name === name)[0].ele
}

export function calc_potion(materials, cauldron){
  let elements = [].concat(get_ele_from_name(materials, cauldron[0]),get_ele_from_name(materials, cauldron[1]))
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