import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.formation.deleteMany();
  await prisma.utilisateur.deleteMany();
  await prisma.thematique.deleteMany();

  const sante = await prisma.thematique.create({
    data: {
      title: "Santé et Secourisme",
      color: "#F5E7FB",
      colorTitle: "#C87CE9",
      formations: {
        create: [
          { title: "Secourisme Niveau 1", numero: 1, duration: "2", presentiel: true, description: `
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
          { title: "Aide aux personnes isolées", numero: 2, duration: "1", presentiel: false, description: "Apprenez à accompagner les personnes isolées dans leur quotidien.", image : "https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/59910/conversions/EuDTImSoQnWqn6BQBgsqwYSHfYkVza-small.jpg?v=1737022229" },
        ],
      },
    },
  })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())