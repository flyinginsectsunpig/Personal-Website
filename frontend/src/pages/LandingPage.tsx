import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SkillNodeMap from "../components/SkillNodeMap";

export default function LandingPage() {
  return (
    <div className="page">
      <motion.section
        className="hero card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="eyebrow">Zakhir Keane McKinnon</p>
        <h1>Enterprise-grade Interactive Portfolio</h1>
        <p>
          Explore live ML inference, Spring Boot architecture, full-stack integration patterns, and
          deployment-ready engineering.
        </p>
        <Link className="button" to="/ml-lab">
          Explore My Skills
        </Link>
      </motion.section>
      <SkillNodeMap />
    </div>
  );
}
