window.BIBLIOTECA_SEED = [
  ["interestelar","Interestelar",2014,"owned","filmes","alta",0,0,["Blu-ray"],"",""],
  ["reino-de-fogo","Reino de Fogo",2002,"owned","filmes","alta",0,0,["Blu-ray"],"",""],
  ["gravidade","Gravidade",2013,"owned","filmes","media",0,0,["Blu-ray"],"","Comprado por R$ 38,41."],
  ["whiplash","Whiplash: Em Busca da Perfeição",2014,"owned","filmes","alta",0,0,["Blu-ray"],"","Comprado na Twiin Vídeo por R$ 50,00."],
  ["cidadao-kane","Cidadão Kane",1941,"owned","filmes","media",0,0,["Blu-ray","Edição de aniversário"],"","Comprado na Twiin Vídeo por R$ 90,00."],
  ["o-aviador","O Aviador",2004,"owned","filmes","media",0,0,["Blu-ray"],"","Comprado na Twiin Vídeo por R$ 70,00."],
  ["jogador-n1","Jogador Nº 1",2018,"owned","filmes","media",0,0,["Blu-ray"],"","Comprado na Twiin Vídeo por R$ 60,00."],
  ["homem-do-futuro","O Homem do Futuro",2011,"owned","filmes","media",0,0,["Blu-ray"],"","Comprado na Twiin Vídeo por R$ 50,00."],
  ["origem","A Origem",2010,"owned","filmes","media",0,0,["Blu-ray"],"",""],
  ["ilha-do-medo","Ilha do Medo",2010,"owned","filmes","media",0,0,["Blu-ray"],"","Comprado por R$ 79,00."],
  ["sem-fronteiras","Star Trek: Sem Fronteiras",2016,"owned","filmes","media",0,0,["Blu-ray"],"",""],
  ["ta-chovendo","Tá Chovendo Hambúrguer",2009,"owned","infantil","baixa",0,0,["Blu-ray","3D"],"",""],
  ["universidade-monstros","Universidade Monstros",2013,"owned","infantil","baixa",0,0,["Blu-ray"],"",""],
  ["intocaveis","Intocáveis",2011,"owned","filmes","media",0,0,["Blu-ray"],"",""],
  ["tintim","As Aventuras de Tintim",2011,"owned","infantil","baixa",0,0,["Blu-ray"],"",""],
  ["mestre-dos-mares","Mestre dos Mares: O Lado Mais Distante do Mundo",2003,"wanted","filmes","alta",55,75,[],"",""],
  ["no-coracao-do-mar","No Coração do Mar",2015,"wanted","filmes","alta",45,65,[],"",""],
  ["chamado-floresta","O Chamado da Floresta",2020,"wanted","filmes","alta",45,65,[],"",""],
  ["a-rede","A Rede",1995,"wanted","filmes","alta",45,65,[],"",""],
  ["hugo-cabret","A Invenção de Hugo Cabret",2011,"wanted","filmes","alta",45,65,[],"",""],
  ["grande-gatsby-antigo","O Grande Gatsby",1974,"wanted","filmes","alta",45,65,[],"",""],
  ["fargo","Fargo",1996,"wanted","filmes","media",45,65,[],"",""],
  ["dogville","Dogville",2003,"wanted","filmes","media",45,65,[],"",""],
  ["a-cura","A Cura",1995,"wanted","filmes","media",45,65,[],"",""],
  ["cinema-paradiso","Cinema Paradiso",1988,"wanted","filmes","media",45,65,[],"",""]
].map(([id,title,year,status,category,priority,targetPrice,limitPrice,tags,coverUrl,notes]) => {
  const now = new Date().toISOString();
  return {id,title,year,status,category,priority,targetPrice,limitPrice,tags,coverUrl,notes,createdAt:now,updatedAt:now};
});
