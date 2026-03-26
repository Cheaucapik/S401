import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.suivi.deleteMany();
  await prisma.session.deleteMany();
  await prisma.benevole.deleteMany();
  await prisma.formateur.deleteMany();
  await prisma.administrateur.deleteMany();
  await prisma.utilisateur.deleteMany();
  await prisma.formation.deleteMany();
  await prisma.thematique.deleteMany();

  const tables = [
    'Thematique', 'Formation', 'Session', 
    'Utilisateur', 'Benevole', 'Formateur', 'Suivi'
  ];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(
      `DELETE FROM sqlite_sequence WHERE name='${table}'`
    );
  }

  const themaSante = await prisma.thematique.create({
    data: {
      title: "Santé et Secourisme",
      color: "#F5E7FB",
      colorTitle: "#C87CE9",
      description : "Apprenez à effectuer les gestes de premiers secours",
      image : "https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/12169/conversions/solidarite-et-insertion-5-small.jpg?v=1737022213",
      formations: {
        create: [
          { title: "Secourisme Niveau 1", numero: 1, duration: 2, presentiel: true, description: `
Lors de cette formation PSC, vous apprenez les gestes de premiers secours afin de savoir réagir efficacement en cas d’accident tels que l’arrêt cardiaque, la perte de connaissance, l’étouffement, les malaises ou encore des traumatismes.
&nbsp;
## Programme de formation
&nbsp;
### Les gestes d'urgence
* Le **massage cardiaque** (30 compressions / 2 insufflations)
* L'utilisation du **DAE** (Défibrillateur)
&nbsp;
### Situations spécifiques
* La personne s'étouffe (Méthode de *Heimlich*)
* La personne saigne abondamment
&nbsp;
> *Note : Une attestation de fin de formation, le diplôme d'état de Premiers Secours Citoyens (PCS) vous sera délivré.*
  `, image : "https://my-security-job.com/static/uploads/2024/10/secourisme-les-principes-essentiels-1024x664.jpg" },
          { title: "Aide aux personnes isolées", numero: 2, duration: 1, presentiel: false, description: "Apprenez à accompagner les personnes isolées dans leur quotidien.", image : "https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/59910/conversions/EuDTImSoQnWqn6BQBgsqwYSHfYkVza-small.jpg?v=1737022229" },
        ],
      },
    },
    include: {
    formations: true,
  },
  })


  await prisma.thematique.create({
    data: {
      title: "Sauvetage animal",
      color: "#ECF3FC",
      colorTitle: "#7CABE9",
      description : "Formez-vous au secourisme canin avec la Fédération Nationale de Protection Civile",
      image : "https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/12189/conversions/protection-de-la-nature-4-small.jpg?v=1737022287",
      formations: {
        create: [
          { title: "Secours canin Niveau 1", numero: 1, duration: 2, presentiel: true, description: `
La formation en Secourisme Canin, proposée par la Protection Civile, vous apprend à adopter les bons réflexes pour faire face aux incidents les plus fréquents chez les animaux : malaises, brûlures, étouffements, ou blessures.
&nbsp;
Cette formation s’adresse à vous si vous êtes en contact régulier avec des animaux (professionnels du secteur animalier, propriétaires de chiens, éducateurs canins…) ou si vous souhaitez simplement être en mesure de réagir efficacement en cas de situation dangereuse impliquant un animal. Grâce à cette formation, vous serez prêt à intervenir et à apporter les premiers secours à votre compagnon à quatre pattes.
&nbsp;
### Comment se déroule la formation secourisme canin ?
La formation en Secourisme Canin, dispensée par la Protection Civile, dure une journée et s’organise autour d’étapes essentielles pour préparer les participants à intervenir efficacement en cas d’urgence impliquant un animal.
&nbsp;
La formation couvre ensuite les gestes de premiers secours adaptés aux animaux, notamment la gestion des blessures, des brûlures, des hémorragies, et des obstructions des voies respiratoires. Ces étapes permettent de stabiliser l’état de l’animal en attendant l’intervention d’un vétérinaire ou d’un secours spécialisé.
&nbsp;
Tout d’abord, les participants apprennent à reconnaître les signes de détresse chez un chien et à évaluer la situation pour donner l’alerte rapidement et de manière appropriée.
  `, image : "https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/12189/conversions/protection-de-la-nature-4-small.jpg?v=1737022287" },
          { title: "Secours canin Niveau 2", numero: 2, duration: 1, presentiel: false, description: "Formez-vous au secourisme canin avec la Fédération Nationale de Protection Civile", image : "https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/12189/conversions/protection-de-la-nature-4-small.jpg?v=1737022287" },
        ],
      },
    },
  })

  const oceane = await prisma.utilisateur.create({
  data:{
    nom: "Huynh",
    prenom : "Océane",
    email : "oceane@test.com",
    password : "1234",
    date_naissance : new Date("2006-11-07"),
    benevole: {
      create: {}
    }
  }
 })

  const jeanFormateur = await prisma.utilisateur.create({
    data: {
      nom: "Dupont",
      prenom: "Jean",
      email: "jean@formateur.com",
      password: "1234",
      date_naissance: new Date("1985-01-01"),
      type_utilisateur: "FORMATEUR",
      formateur: { create: {} }
    }
  });

  // L'Administrateur
  const bossAdmin = await prisma.utilisateur.create({
    data: {
      nom: "Admin",
      prenom: "Le Boss",
      email: "admin@system.com",
      password: "root",
      date_naissance: new Date("1990-01-01"),
      type_utilisateur: "ADMIN",
      administrateur: { create: {} }
    }
  });

  const sessionSecours = await prisma.session.create({
    data: {
      date_deb: new Date("2024-06-01T09:00:00"),
      date_fin: new Date("2024-06-01T17:00:00"),
      presentiel: true,
      lieu: "Centre de secours Vitry",
      idFormation: themaSante.formations[0].id_formation,
      idFormateur: jeanFormateur.id_utilisateur
    }
  });

  await prisma.suivi.create({
    data: {
      statut: false, // true pour "Bon / Validé"
      idBenevole: oceane.id_utilisateur,
      idSession: sessionSecours.id_session
    }
  });

  }

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())