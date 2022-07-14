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


