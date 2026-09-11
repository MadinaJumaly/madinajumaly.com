import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button/Button';
import { addSkill, removeSkill } from '../../features/skills/skillsSlice';
import './SkillsSection.scss';

// Tick positions along the scale, as a percentage of its width (design: 0 / 201 / 762 /
// 963 of 964px).
const SCALE_MARKS = [
  { label: 'Beginner', percent: 0 },
  { label: 'Proficient', percent: 20.85 },
  { label: 'Expert', percent: 79.05 },
  { label: 'Master', percent: 100 },
];

const SKILL_RANGE_MIN = 10;
const SKILL_RANGE_MAX = 100;

const SkillSchema = Yup.object({
  name: Yup.string().required('Skill name is a required field'),
  range: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .typeError("Skill range must be a 'number' type")
    .required('Skill range is a required field')
    .min(SKILL_RANGE_MIN, `Skill range must be greater than or equal to ${SKILL_RANGE_MIN}`)
    .max(SKILL_RANGE_MAX, `Skill range must be less than or equal to ${SKILL_RANGE_MAX}`),
});

const SkillsSection = () => {
  const dispatch = useDispatch();
  // Skills start empty and are restored from localStorage — the API is not used to seed
  // them, per "The Skills state (which is empty by default)".
  const { items, status, error } = useSelector((state) => state.skills);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    const result = await dispatch(
      addSkill({ name: values.name.trim(), range: Number(values.range) })
    );
    if (addSkill.fulfilled.match(result)) resetForm();
  };

  return (
    <div className="skills">
      <div className="skills__toggle-row">
        <Button
          variant="dark"
          icon={faPenToSquare}
          onClick={() => setIsFormOpen((prev) => !prev)}
          ariaExpanded={isFormOpen}
        >
          {isFormOpen ? 'Close edit' : 'Open edit'}
        </Button>
      </div>

      {isFormOpen && (
        <Formik
          initialValues={{ name: '', range: '' }}
          validationSchema={SkillSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty }) => (
            <Form className="skills__form" noValidate>
              <div className="skills__field">
                <label className="skills__label" htmlFor="skill-name">
                  Skill name:
                </label>
                <div className="skills__control">
                  <Field
                    id="skill-name"
                    className="skills__input"
                    name="name"
                    type="text"
                    placeholder="Enter skill name"
                  />
                  <ErrorMessage name="name" component="span" className="skills__error" />
                </div>
              </div>

              <div className="skills__field">
                <label className="skills__label" htmlFor="skill-range">
                  Skill range:
                </label>
                <div className="skills__control">
                  <Field
                    id="skill-range"
                    className="skills__input"
                    name="range"
                    type="text"
                    placeholder="Enter skill range"
                  />
                  <ErrorMessage name="range" component="span" className="skills__error" />
                </div>
              </div>

              <Button type="submit" variant="dark" disabled={!isValid || !dirty}>
                Add skill
              </Button>
            </Form>
          )}
        </Formik>
      )}

      {error && <p className="skills__notice skills__notice--error">{error}</p>}

      <ul className="skills__list">
        {items.map((skill) => {
          const skillId = skill.id ?? skill.name;
          return (
            <li key={skillId} className="skills__bar" style={{ width: `${skill.range}%` }}>
              <span className="skills__bar-label">{skill.name}</span>
              <button
                type="button"
                className="skills__remove"
                // The bar's own text is the skill name, so the control needs its own name.
                aria-label={`Remove ${skill.name}`}
                onClick={() => dispatch(removeSkill(skillId))}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="skills__scale">
        {SCALE_MARKS.map(({ label, percent }) => (
          <span key={label} className="skills__mark" style={{ left: `${percent}%` }}>
            <span className="skills__mark-label">{label}</span>
          </span>
        ))}
      </div>

      {status === 'loading' && (
        <div className="skills__overlay">
          <FontAwesomeIcon icon={faSyncAlt} className="icon" spin />
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
