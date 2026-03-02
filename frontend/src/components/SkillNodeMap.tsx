import { motion } from "framer-motion";

const nodes = [
  "Machine Learning",
  "Spring Boot",
  "Full Stack",
  "Data Engineering",
  "DevOps",
  "3D Web"
];

export default function SkillNodeMap() {
  return (
    <section className="card">
      <h2>Skill Constellation</h2>
      <div className="node-map">
        {nodes.map((node, idx) => (
          <motion.div
            key={node}
            className="node"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {node}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
